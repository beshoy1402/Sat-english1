# AI assistant and live support setup

## AI assistant (server-side)
Configure these Vercel environment variables for Preview and Production:
- `AI_API_KEY`: secret API key from an OpenAI-compatible model provider.
- `AI_API_BASE_URL`: optional chat-completions endpoint; defaults to `https://api.openai.com/v1/chat/completions`.
- `AI_MODEL`: optional model identifier; defaults to `gpt-4o-mini`.

The API key is read only on the server and is never exposed to the browser. Without `AI_API_KEY`, the widget displays a clear setup message and directs students to live support.

## Live support
Students must sign in. Messages are stored in the database and shown in the Admin dashboard's Live Support Inbox. The student widget and admin inbox refresh periodically (polling); this is not WebSocket-based instant messaging and staff response times depend on the academy team.

## Database migration required
The `SupportConversation` and `SupportMessage` tables were added to Prisma. Before enabling live support on a deployed environment, apply the schema to the configured database using the project's normal migration/change-control process (for this SQLite-backed project, `npx prisma db push`). Back up production data first. Do not run schema pushes against a live database without verifying its backup and connection target.
