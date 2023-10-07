import Redis from 'ioredis';

const getRedis = () => {
    if (process.env.REDIS_URL) {
        return process.env.REDIS_URL
    }
    throw new Error('REDIS_URL not found');
};

export const redis = new Redis(getRedis());