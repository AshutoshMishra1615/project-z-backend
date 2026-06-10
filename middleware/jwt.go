package middleware

import (
	"errors"
	"net/http"
	"strings"
	"time"

	"project-z-backend/config"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		cfg := config.GetConfig()

		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header missing"})
			c.Abort()
			return
		}

		if !strings.HasPrefix(authHeader, "Bearer ") {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid Authorization header format"})
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		secret := cfg.JWT_SECRET
		if len(secret) == 0 {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "JWT secret not set"})
			c.Abort()
			return
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrSignatureInvalid
			}
			return []byte(secret), nil
		})

		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or malformed token"})
			c.Abort()
			return
		}

		if !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Expired or invalid token"})
			c.Abort()
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
			c.Abort()
			return
		}

		var userID int64
		switch v := claims["user_id"].(type) {
		case float64:
			userID = int64(v)
		case int64:
			userID = v
		case int:
			userID = int64(v)
		default:
			userID = 0
		}

		role := "user"
		if r, ok := claims["role"].(string); ok {
			role = r
		}

		c.Set("user_id", userID)
		c.Set("email", claims["email"])
		c.Set("role", role)

		c.Next()
	}
}

// AdminMiddleware ensures only admin users can access the route
func AdminMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("role")
		if !exists || role != "admin" {
			c.JSON(http.StatusForbidden, gin.H{"error": "Admin access required"})
			c.Abort()
			return
		}
		c.Next()
	}
}

func CreateJWT(userID int64, email string, role string) (string, error) {
	cfg := config.GetConfig()
	secret := cfg.JWT_SECRET

	if secret == "" {
		return "", errors.New("JWT_SECRET not configured")
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": userID,
		"email":   email,
		"role":    role,
		"exp":     time.Now().Add(time.Hour * 24 * 5).Unix(),
	})

	tokenString, err := token.SignedString([]byte(secret))
	if err != nil {
		return "", errors.New("Failed to generate token")
	}

	return tokenString, nil
}
