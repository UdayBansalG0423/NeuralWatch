import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
	raise RuntimeError(
		"DATABASE_URL is not set. Create backend/.env with: "
		"DATABASE_URL=postgresql://user:password@localhost:5432/neuralwatch"
	)
