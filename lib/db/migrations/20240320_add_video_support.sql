-- Add video_url and is_generating_video columns to messages table
ALTER TABLE messages
ADD COLUMN video_url TEXT,
ADD COLUMN is_generating_video BOOLEAN DEFAULT FALSE; 