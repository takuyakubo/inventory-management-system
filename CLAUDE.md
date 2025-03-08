# Project Helper Information

## Build Commands
- Backend: `uvicorn main:app --reload` (FastAPI development server)
- Frontend: `npm run dev` (Next.js development), `npm run build` (production)
- Full stack: `docker-compose up -d` (development environment)

## Lint Commands
- Backend: `black .`, `isort .`, `flake8 .`
- Frontend: `npm run lint`, `npm run format`

## Test Commands
- Backend: 
  - All tests: `pytest`
  - Single test: `pytest tests/test_file.py::test_name -v`
- Frontend:
  - All tests: `npm test`
  - Single test: `npm test -- -t "test name"`
- E2E: `npm run cypress`

## Code Style Guidelines
- Use TypeScript for frontend, Python with type hints for backend
- Follow RESTful API design patterns
- Implement proper error handling with specific error types
- Document all functions/components with docstrings/JSDoc
- Follow Atomic Design for frontend components
- Use Pydantic models for data validation in FastAPI
- Maintain 80%+ test coverage for critical code paths
- Use descriptive variable/function names reflecting purpose