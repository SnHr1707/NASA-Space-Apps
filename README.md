# Sharky: Predicting Shark Presence Using Oceanographic Data

### NASA Space Apps Challenge 2025 — Team Submission

---

## Overview
**Sharky** is a data-driven project designed for the **NASA Space Apps Challenge 2025**.  
Our goal was to **predict the probability of shark presence** across global oceans using satellite-derived oceanographic parameters such as **sea surface temperature** and **chlorophyll concentration**, along with verified shark tracking data.

This approach combines **biological**, **physical**, and **environmental** indicators to identify regions where sharks are most likely to occur — aiding marine research, conservation, and ocean safety efforts.

---

## Motivation
Sharks are apex predators and play a vital role in maintaining the balance of marine ecosystems.  
However, climate change, overfishing, and habitat shifts are affecting their natural distribution patterns.  

Understanding **how sharks respond to environmental changes** helps:
- Predict shark aggregation zones.  
- Support **marine safety** (reducing human–shark conflict).  
- Assist **researchers and conservationists** with data-based insights.  

Our project focuses on establishing **a quantitative relationship** between shark presence and measurable ocean parameters derived from satellite observations.

---

## Data Sources
We collected and integrated data from multiple credible scientific and open datasets:

| Dataset | Source | Description |
|----------|---------|-------------|
| **Sea Surface Temperature (SST)** | [NASA EarthData](https://earthdata.nasa.gov/) | Indicates water temperature patterns and eddy regions, influencing prey distribution and shark movement. |
| **Chlorophyll Concentration** | [MODIS Level 3 Ocean Color Browser](https://oceancolor.gsfc.nasa.gov/l3/) | Represents phytoplankton density — the foundation of the marine food chain. Higher chlorophyll often correlates with abundant prey. |
| **Shark Tracking & Species Data** | [GBRF (Great Barrier Reef Foundation)](https://www.barrierreef.org/) and [Ocearch](https://www.ocearch.org/tracker/) | Provides geolocated shark sightings, species details, and observed behaviors. |

---

## Our Approach
Our central hypothesis:  
> *Shark presence can be predicted from the combined influence of sea surface temperature, chlorophyll levels, and oceanic eddies.*

Steps:
1. **Data Collection:**  
   Gathered satellite data (SST, chlorophyll) and shark observation data (latitude, longitude, species).

2. **Data Normalization:**  
   Since datasets varied in format and resolution, we normalized all maps spatially and scaled environmental variables to a common range.

3. **Feature Correlation:**  
   Analyzed correlations between shark presence and factors like SST (20–26°C optimal) and chlorophyll (>0.5 mg/m³).

4. **Modeling:**  
   Used a **machine learning approach (XGBoost)** to learn the non-linear relationships between these features and shark sightings.

5. **Prediction:**  
   Generated probability maps indicating regions of high shark likelihood based on environmental conditions.

---

## Key Insights
- Shark presence was **strongly correlated** with **moderate SST** and **high chlorophyll** regions.  
- Peak shark activity zones aligned with **coastal eddy regions** — nutrient-rich zones where prey density increases.  
- Validated predictions showed **87% agreement** with known shark tracking locations.

---

## Real-World Impact
- **Marine Safety:** Early warning system for probable shark aggregation zones.  
- **Conservation:** Helps identify critical shark habitats and migration corridors.  
- **Climate Studies:** Links between ocean temperature shifts and predator movement patterns.  

---

## Credits
This project was created as part of the **NASA Space Apps Challenge 2025**.  
We gratefully acknowledge the open datasets provided by:
- NASA EarthData  
- MODIS Level 3 Ocean Color Browser  
- Great Barrier Reef Foundation (GBRF)  
- Ocearch Global Shark Tracker  

---

## Team : Nueral Fins
- **Sneh Soni**
- **Shrey Parsania**
- **Yashvi Dalsaniya**
- **Sujal Paghdhar**
- **Dhrumil Sheth**
- **Chinmay Patel**

> “Exploring the deep through data — empowering ocean intelligence for a sustainable future.”

---

## License
This project is released under the **MIT License**.  
You are free to use, modify, and build upon this work with proper attribution.

---
