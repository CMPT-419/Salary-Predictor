import pandas as pd
from ucimlrepo import fetch_ucirepo
from folktables import ACSDataSource, ACSIncome

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
    ca_data = data_source.get_data(states=['CA'], download=True)
    features, labels, _ = ACSIncome.df_to_pandas(ca_data)
    
    # The 'labels' DataFrame contains the target variable 'PINCP'
    y_reg = labels['PINCP']
    X_reg = features

    # Convert y_reg to numeric
    y_reg = pd.to_numeric(y_reg, errors='coerce').fillna(0)

    # Filter out rows where income is 0 or negative
    positive_income_mask = y_reg > 0
    X_reg = X_reg[positive_income_mask]
    y_reg = y_reg[positive_income_mask]

    # Select features
    feature_cols = ['AGEP', 'SCHL', 'MAR', 'RAC1P', 'SEX', 'POBP', 'OCCP']
    X_reg = X_reg[feature_cols]

    return X_reg, y_reg
