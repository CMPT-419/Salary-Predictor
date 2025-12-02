import pandas as pd
from ucimlrepo import fetch_ucirepo
from folktables import ACSDataSource
import sys
import os

# Add the project root to the Python path to allow for absolute imports
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from mappings import map_education, map_occupation

def load_acs_data():
    """
    Fetches, preprocesses, and maps ACS PUMS data using shared mapping logic.
    """
    # ... (rest of the file remains the same)
    data_source = ACSDataSource(survey_year='2018', horizon='1-Year', survey='person')
    raw_df = data_source.get_data(states=['CA'], download=True)

    # --- Preprocessing ---
    numeric_cols = ['PINCP', 'WKHP', 'AGEP', 'SCHL', 'OCCP', 'MAR', 'SEX', 'COW', 'RAC1P']
    for col in numeric_cols:
        raw_df[col] = pd.to_numeric(raw_df[col], errors='coerce')

    raw_df.dropna(subset=['PINCP', 'WKHP', 'OCCP', 'SCHL'], inplace=True)
    
    # Apply filters
    filtered_df = raw_df[(raw_df['WKHP'] > 0) & (raw_df['PINCP'] >= 1000)].copy()

    # --- Apply Mappings ---
    filtered_df['SCHL'] = filtered_df['SCHL'].apply(map_education)
    filtered_df['OCCP'] = filtered_df['OCCP'].apply(map_occupation)
    
    # --- Feature Selection ---
    # Ensure MAR, SEX, COW are strings for one-hot encoding
    filtered_df['MAR'] = filtered_df['MAR'].astype(str)
    filtered_df['SEX'] = filtered_df['SEX'].astype(str)
    filtered_df['COW'] = filtered_df['COW'].astype(str)
    filtered_df['RAC1P'] = filtered_df['RAC1P'].astype(str) # Add race for fairness analysis

    feature_cols = ['AGEP', 'SCHL', 'MAR', 'SEX', 'COW', 'WKHP', 'OCCP', 'RAC1P']
    target_col = 'PINCP'

    filtered_df.dropna(subset=feature_cols, inplace=True)

    X = filtered_df[feature_cols]
    y = filtered_df[target_col]

    return X, y

def load_uci_data():
    """
    Fetches and preprocesses the UCI Adult dataset.
    """
    adult = fetch_ucirepo(id=2)
    X = adult.data.features
    y = adult.data.targets.iloc[:, 0]
    y = y.str.strip().str.replace(r"\.", "", regex=True)
    y = y.map({'<=50K': 0, '>50K': 1})
    return X, y
