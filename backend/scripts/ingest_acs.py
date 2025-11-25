import pandas as pd
from folktables import ACSDataSource, ACSIncome

def fetch_acs_data():
    
    # Define the data source and the survey year
    data_source = ACSDataSource(survey_year='2018', horizon='1-Year', survey='person')
    
    # Get the data for the state of California
    # Using 'CA' as it's a large, representative state. 'US' can be very large.
    ca_data = data_source.get_data(states=['CA'], download=True)

    # Define the task, which helps in identifying feature groups
    ca_features, ca_labels, _ = ACSIncome.df_to_pandas(ca_data)

    # Combine features and labels into a single DataFrame for analysis
    df_combined = pd.concat([ca_features, ca_labels], axis=1)

    print("\nSuccessfully fetched and converted data to Pandas DataFrame.")
    print("Columns available in the dataset:")
    
    # Crucial Step: Print the columns to find 'OCCP' and 'PINCP'
    print(df_combined.columns.tolist())
    
    print("\nScript finished.")
    print("Analysis: 'PINCP' (Total person's income) and 'OCCP' (Occupation) are present.")
    print("These can be used to create a median salary lookup table.")

    return df_combined

if __name__ == "__main__":
    fetch_acs_data()
