package auth

import (
	"errors"
	"fmt"
	"time"

	"github.com/dgrijalva/jwt-go"
)

// Secret key used for signing JWT (in production, store it securely)
var SecretKey = []byte("your-256-bit-secret")

// CreateToken generates a new JWT token
func CreateToken(username string) (string, error) {
	// Create the JWT claims, which includes the username and expiration time
	claims := jwt.MapClaims{
		"username": username,
		"exp":      time.Now().Add(time.Hour * 24).Unix(), // Expires in 24 hours
	}

	// Create the token using the claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Sign the token with our secret key
	tokenString, err := token.SignedString(SecretKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

// ParseToken parses and validates the JWT token
func ParseToken(tokenString string) (*jwt.Token, error) {
	// Parse the token and validate it
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Ensure the token's signing method is what we expect
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method")
		}
		return SecretKey, nil
	})
	if err != nil {
		return nil, err
	}

	return token, nil
}

// Function to verify the JWT token
func VerifyToken(tokenString string) (jwt.Claims, error) {
	// Parse the token
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Ensure that the signing method is correct
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return SecretKey, nil
	})

	if err != nil || !token.Valid {
		return nil, err
	}

	// Return the claims if the token is valid
	return token.Claims, nil
}
