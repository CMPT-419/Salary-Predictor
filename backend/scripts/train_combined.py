from train_uci import train_and_save_classifier
from train_acs import train_and_save_quantile_regressors

def train_all():
    """
    Trains and saves both the UCI classifier and the ACS regressor.
    """
    print("--- Starting Training for All Models ---")
    train_and_save_classifier()
    print("--- UCI Classifier Training Complete ---")
    print("\n")
    print("--- Starting ACS Regressor Training ---")
    train_and_save_quantile_regressors()
    print("--- ACS Regressor Training Complete ---")
    print("\n--- All training tasks complete. ---")


if __name__ == "__main__":
    train_all()
