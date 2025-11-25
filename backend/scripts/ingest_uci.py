from ucimlrepo import fetch_ucirepo
import pandas as pd

def load_adult_data():
    
    # fetch dataset 
    adult = fetch_ucirepo(id=2) 
      
    # data (as pandas dataframes) 
    X = adult.data.features 
    y = adult.data.targets 
      
    # metadata 
    print("Metadata:")
    print(adult.metadata) 
      
    # variable information 
    print("Variable Info:")
    print(adult.variables)

    return X, y

if __name__ == "__main__":
    load_adult_data()
