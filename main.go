package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"task-management-backend/ai"
	"task-management-backend/internal/auth"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/joho/godotenv"
	"github.com/sashabaranov/go-openai"
)

func init() {
	// Load .env file
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file. Make sure the .env file exists and is properly formatted.")
	} else {
		fmt.Println(".env file loaded successfully.")
	}
}

type Task struct {
	ID          uint      `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Status      string    `json:"status"`
	AssignedTo  string    `json:"assigned_to"`
	CreatedAt   time.Time `json:"created_at"`
}

var tasks []Task // Temporary storage for tasks
var taskID uint

// Middleware to check if the token is valid
func tokenAuthMiddleware(c *gin.Context) {
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header missing"})
		c.Abort()
		return
	}
	tokenString := authHeader[len("Bearer "):]
	_, err := auth.VerifyToken(tokenString)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
		c.Abort()
		return
	}
	c.Next() // Allow the request to continue
}

func main() {

	// Example task title
	taskTitle := "Create a new feature"

	// Call the AI service to generate task breakdown
	breakdown, err := ai.GetTaskBreakdown(taskTitle)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Generated Breakdown: ", breakdown)

	// Initialize Gin router
	r := gin.Default()

	// Simple route to check server is working
	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Welcome to the Task Management System API!",
		})
	})

	r.POST("/login", func(c *gin.Context) {
		username := c.DefaultPostForm("username", "")
		if username == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Username is required"})
			return
		}
		token, err := auth.CreateToken(username)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate token"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"token": token})
	})

	// Protected route to fetch all tasks
	r.GET("/tasks", func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header missing"})
			return
		}
		tokenString := authHeader[len("Bearer "):]
		_, err := auth.VerifyToken(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			return
		}

		c.JSON(http.StatusOK, tasks)
	})

	// Route to create a task (POST /tasks)
	r.POST("/tasks", func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header missing"})
			return
		}
		tokenString := authHeader[len("Bearer "):]
		_, err := auth.VerifyToken(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			return
		}

		var newTask Task
		if err := c.BindJSON(&newTask); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
			return
		}

		// Generate AI breakdown for the task title
		breakdown, aiErr := ai.GetTaskBreakdown(newTask.Title)
		if aiErr != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate task breakdown"})
			return
		}

		// Task breakdown: You can integrate AI to generate a description or breakdown of the task here
		newTask.Description = breakdown // Example of using AI-generated task breakdown

		taskID++
		newTask.ID = taskID
		newTask.CreatedAt = time.Now()

		tasks = append(tasks, newTask)

		c.JSON(http.StatusCreated, newTask)
	})

	// Route to update a task (PUT /tasks/:id)
	r.PUT("/tasks/:id", func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header missing"})
			return
		}
		tokenString := authHeader[len("Bearer "):]
		_, err := auth.VerifyToken(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			return
		}

		// Get task ID from URL
		id := c.Param("id")

		// Find task by ID and update status
		for i, task := range tasks {
			if fmt.Sprintf("%v", task.ID) == id {
				var updatedTask Task
				if err := c.BindJSON(&updatedTask); err != nil {
					c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
					return
				}
				tasks[i].Status = updatedTask.Status
				c.JSON(http.StatusOK, tasks[i])
				return
			}
		}

		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
	})

	// Route to delete a task (DELETE /tasks/:id)
	r.DELETE("/tasks/:id", func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header missing"})
			return
		}
		tokenString := authHeader[len("Bearer "):]
		_, err := auth.VerifyToken(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			return
		}

		// Get task ID from URL
		id := c.Param("id")

		// Find and delete the task
		for i, task := range tasks {
			if fmt.Sprintf("%v", task.ID) == id {
				tasks = append(tasks[:i], tasks[i+1:]...)
				c.JSON(http.StatusOK, gin.H{"message": "Task deleted"})
				return
			}
		}

		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
	})

	// Run the server on port 8080
	if err := r.Run(":8080"); err != nil {
		fmt.Printf("Error starting the server: %v", err)
	}

	// Example to call the completion function when needed (if required)
	generateCompletion()
}

// Function to generate completion using OpenAI API
func generateCompletion() {
	apiKey := "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"
	if apiKey == "" {
		log.Fatal("API key is not set")
	} else {
		fmt.Println("Loaded API key successfully.")
	}

	client := openai.NewClient(apiKey)

	// Creating a request to generate text completion
	req := openai.CompletionRequest{
		Model:     openai.GPT3TextDavinci003, // or another model
		Prompt:    "Write a story about a brave knight.",
		MaxTokens: 100,
	}

	// Make the request to OpenAI's API
	resp, err := client.CreateCompletion(context.Background(), req)
	if err != nil {
		log.Println("Error in AI request:", err)
		return
	}

	if len(resp.Choices) > 0 {
		// Output the response (the generated text)
		fmt.Println("Generated Text:", resp.Choices[0].Text)
	} else {
		log.Println("No completions returned.")
	}
	// Output the response (the generated text)
	fmt.Println("Generated Text:", resp.Choices[0].Text)
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}
