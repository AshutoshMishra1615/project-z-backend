package cache

import (
	"context"
	"log"

	"github.com/redis/go-redis/v9"
)

var RedisClient *redis.Client

func InitRedis(redisURL string) {
	opts, err := redis.ParseURL(redisURL)
	if err != nil {
		log.Fatal("Invalid REDIS_URL: ", err)
	}

	RedisClient = redis.NewClient(opts)

	ctx := context.Background()
	if err := RedisClient.Ping(ctx).Err(); err != nil {
		log.Fatal("Cannot connect to Redis: ", err)
	}

	log.Println("Connected to Redis")
}
