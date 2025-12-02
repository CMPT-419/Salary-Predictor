# backend/mappings.py

EDUCATION_MAP = {
    24: "Doctorate",
    23: "Masters",
    22: "Masters",
    21: "Bachelors",
    20: "High School/Some College",
    19: "High School/Some College",
    18: "High School/Some College",
    17: "High School/Some College",
    16: "High School/Some College",
}

# Simplified mapping for OCCP codes
OCCUPATION_MAP = {
    (10, 999): "Management & Business",
    (1000, 1999): "Tech & Engineering",
    (2900, 3599): "Healthcare",
    (3600, 4699): "Service & Blue Collar",
    (4100, 5999): "Sales & Office",
    (6000, 9999): "Service & Blue Collar",
}

def map_education(schl_code):
    """Maps ACS SCHL code to an educational category string using a dictionary."""
    if schl_code < 16:
        return "Less than HS"
    return EDUCATION_MAP.get(schl_code, "Other")

def map_occupation(occp_code):
    """Maps 4-digit OCCP code to a broader industry category using a dictionary with ranges."""
    for (start, end), category in OCCUPATION_MAP.items():
        if start <= occp_code <= end:
            return category
    return "Other"
