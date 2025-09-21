import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function GET(request: NextRequest) {
  try {
    // Create forum_comments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS forum_comments (
        id VARCHAR(255) PRIMARY KEY,
        forum_id VARCHAR(255) NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        parent_id VARCHAR(255) NULL,
        content TEXT NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "deletedAt" TIMESTAMP WITH TIME ZONE NULL,
        
        FOREIGN KEY (forum_id) REFERENCES forum_posts(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (parent_id) REFERENCES forum_comments(id) ON DELETE CASCADE
      )
    `);

    // Create indexes
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_forum_comments_forum_id ON forum_comments(forum_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_forum_comments_user_id ON forum_comments(user_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_forum_comments_parent_id ON forum_comments(parent_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_forum_comments_created_at ON forum_comments("createdAt")`);

    // Check if table was created successfully
    const tableCheck = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'forum_comments'
    `);

    // Get table structure
    const tableStructure = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'forum_comments'
      ORDER BY ordinal_position
    `);

    return NextResponse.json({
      success: true,
      message: "Forum comments table created successfully",
      tableExists: tableCheck.rows.length > 0,
      structure: tableStructure.rows
    });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}