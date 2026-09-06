# AI and scoring

Jalur B uses Muse Spark 1.2 Contributor Free through OpenCode Zen for bounded
classification and Indonesian
explanations. Numeric scores are calculated by backend code under `career-resilience-v1`;
the model never supplies final numeric scores.

## Provider

- Provider: OpenCode Zen through its OpenAI Responses-compatible API
- Default model: `muse-spark-1.2-contributor-free`
- Responses use JSON Schema mode and are validated again with Pydantic.
- Contributor Free prompts and completions may be used to train future Meta models.
- Prompt version: `career-analysis-v1`
- Provider failures do not create partial assessment snapshots.

## Category mappings

| Category | Score |
| --- | ---: |
| weak | 35 |
| moderate | 65 |
| strong | 85 |
| low exposure | 25 |
| medium exposure | 55 |
| high exposure | 80 |
| declining relevance | 35 |
| stable relevance | 65 |
| rising relevance | 90 |

## Formulas

AI Exposure is the arithmetic mean of classified activity exposure scores.

Skill Relevance is the arithmetic mean of the user's classified skill relevance scores.

```text
Career Risk =
  40% activity automation exposure
  + 25% market-demand risk
  + 20% skill-dependency risk
  + 15% industry-volatility risk
```

```text
Pivot Match =
  55% skill fit
  + 20% activity fit
  + 15% experience fit
  + 10% industry fit
```

```text
Financial Readiness = min(runway months / 6 * 100, 100)
```

The current Financial Readiness value is recalculated in the same transaction whenever the
financial profile or any asset is created, updated, or deleted. `GET /api/career-health/latest`
combines that current value with the saved non-financial dimensions, so the Financial
Readiness factor and overall Career Health respond to financial changes without rerunning
the AI provider. Existing layoff simulations remain immutable snapshots; a newly created
simulation uses the current Financial Readiness and recomposed Career Health values.

```text
Career Health =
  25% performance and growth
  + 25% skill relevance
  + 15% adaptability
  + 15% mobility
  + 20% financial readiness
```

```text
Overall Resilience =
  30% financial readiness
  + 30% career health
  + 20% skill relevance
  + 20% job mobility
```

Health levels use `<60 low`, `60-74.99 medium`, and `>=75 high`. Risk and exposure levels
use `<40 low`, `40-69.99 medium`, and `>=70 high`.

Data Confidence measures availability of profile identity, responsibilities, skills,
evidence/performance context, and financial data. It is not prediction accuracy.

## API workflow

- `POST /api/ai-exposure`, `/api/career-risk`, `/api/career-pivot`, and
  `/api/career-health` run the same complete bundle and return one section.
- Each feature has a `/latest` read endpoint.
- `POST /api/layoff-simulations` consumes the latest F1-F4 and financial snapshots.
- `POST /api/profile/cv/preview` extracts PDF or DOCX text locally, then returns a
  reviewable profile, skill, and career-history draft without changing account data.
- `POST /api/profile/cv/confirm` atomically applies the reviewed non-null profile fields,
  merges skills, and saves the reviewed career history. The frontend sends the
  user-edited values; the source CV file is not retained.
- Evidence `impact` is optional.

Assessment snapshots store the model, prompt version, scoring version, and factual input
snapshot. Historical scores are not recalculated when formulas or models change.

## Limitations

- Results are decision support, not employment predictions.
- User-authored facts can be incomplete or inaccurate.
- CV text sent to the Contributor Free model may be used for future Meta model training.
- Scanned PDFs require OCR and are rejected by the current text-only CV extractor.
- The three layoff scenarios change timing and action due dates. They do not project savings
  before a layoff because the current financial profile does not store monthly income.
