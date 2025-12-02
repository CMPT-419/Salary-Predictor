import pandas as pd
from ucimlrepo import fetch_ucirepo
from folktables import ACSDataSource

def load_uci_data():
    """
    Fetches and preprocesses the UCI Adult dataset.
    """
    adult = fetch_ucirepo(id=2)
    X = adult.data.features
    y = adult.data.targets.iloc[:, 0]
    # Clean target labels
    y = y.str.strip().str.replace(r"\.", "", regex=True)
    y = y.map({'<=50K': 0, '>50K': 1})
    return X, y

def load_acs_data():
    """
    Fetches and preprocesses the ACS Public Use Microdata Sample (PUMS) data.
    """
    data_source = ACSDataSource(survey_year='2018', horizon='1-Year', survey='person')
    raw_df = data_source.get_data(states=['CA'], download=True)

    # Ensure PINCP is numeric and filter
    raw_df['PINCP'] = pd.to_numeric(raw_df['PINCP'], errors='coerce')
    raw_df.dropna(subset=['PINCP'], inplace=True)
    filtered_df = raw_df[raw_df['PINCP'] >= 1000].copy()

    # Define features and target
    feature_cols = ['AGEP', 'SCHL', 'MAR', 'SEX', 'OCCP', 'WKHP', 'COW']
    target_col = 'PINCP'
    
    # Ensure feature columns are of correct type
    for col in ['AGEP', 'SCHL', 'MAR', 'WKHP', 'COW']:
        filtered_df[col] = pd.to_numeric(filtered_df[col], errors='coerce')
    
    # OCCP and SEX should be treated as categorical. Let's ensure they are strings.
    filtered_df['OCCP'] = filtered_df['OCCP'].astype(str)
    filtered_df['SEX'] = filtered_df['SEX'].astype(str)
    
    # Drop rows with NaNs in feature columns
    filtered_df.dropna(subset=feature_cols, inplace=True)
    
    X = filtered_df[feature_cols]
    y = filtered_df[target_col]

    return X, y