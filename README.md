# AgriSense // Predictive Intelligence

AgriSense is a highly polished, production-ready full-stack analytical platform designed to forecast agricultural yields. It leverages continuous machine learning branch logic mapped against historic crop data to return precise metric outputs based on regional and environmental inputs.

## High-Fidelity UI/UX Structure

The front end has been completely overhauled around the **Obsidian Vault** design paradigm. 
- **Cinematic Rendering:** Leveraging `GSAP` layout timelines, backdrop blurring, fluid grid positioning, and purely CSS-based geometric noise architecture.
- **Dynamic Data Interfacing:** Natively fetches configuration schemas (available States, Crops, Seasons) dynamically via asynchronous backend endpoints linked directly to the trained `LabelEncoder` parameters.
- **Structural Integrity:** Natively engineered for extreme responsiveness. Mobile triggers off-canvas drawers, Tablets generate massive 2-column tactical layouts, and Desktop runs horizontal sidebar anchoring.

## The Model Engine

Our initial approach scoped an elementary Multiple Linear Regression algorithm. However, agricultural prediction maps heavily to non-linear rules (parsing over 100 crop varieties across varied ecological zones). Linear Regression severely plateaued at an unviable `R² = 0.088`.

To mathematically intercept these vectors, the core calculation engine was transitioned to an advanced **Random Forest Regressor**. Rather than trying to draw a linear approximation, it evaluates continuous branching logic (e.g. tracking specific crop performances during specific seasons relative to localized regions) resulting in a massive boost to ~88% precision (`R² = 0.885`).

### Technology Stack
**Core Backend**
- **Language**: Python
- **API Framework**: FastAPI
- **Inference Engine**: `scikit-learn` & `joblib`

**Presentation Shell (Frontend)**
- **Framework**: React / Vite
- **Styling Architecture**: Tailwind CSS
- **Animation Backbone**: GSAP / Lucide React

---

## Local Development Execution

### 1. Booting the Computing Node (Backend)

Open a terminal and step into the backend root:
```bash
cd backend
```

Deploy the virtual environment:
- **Windows**: `venv\Scripts\activate`
- **macOS/Linux**: `source venv/bin/activate`

Acquire the dependency protocols:
```bash
pip install -r requirements.txt
```

Launch the inference server:
```bash
uvicorn main:app --reload
```
*The endpoint will connect locally to `http://127.0.0.1:8000`.*

### 2. Booting the Presentation Shell (Frontend)

Establish a secondary terminal instance and step into the frontend root:
```bash
cd frontend
```

Download module packages:
```bash
npm install
```

Start the Vite development compiler:
```bash
npm run dev
```
*The shell will execute locally at `http://localhost:5173`.*

## System Usage

1. Open the local compiler port in your browser.
2. Select your environmental variables via the dropdown arrays (these are structurally locked to valid parameters via the backend `/options` schema).
3. Input the required variable surface area in hectares.
4. Execute the calculation to trigger the dashboard result module.