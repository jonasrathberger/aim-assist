import pandas as pd

users = [f"p{i}" for i in range(1, 13)]  # List of users p1 to p12
systems = ["aim-assist", "aim-guidance", "nothing"]

def process_file(filepath, user, system):
    # Load the file
    df = pd.read_csv(filepath)

    # Identify and remove the first 4 tasks with the same start timestamp
    if 'StartTime' in df.columns:
        timestamps_to_remove = df['StartTime'].unique()[:4]  # Get first 4 unique timestamps
        df = df[~df['StartTime'].isin(timestamps_to_remove)]  # Filter out those rows

    # Merge all tasks with the same start timestamp
    df = df.groupby('StartTime', as_index=False).agg({
        'EndTime': 'max',                  # Take the latest end timestamp
        'Duration': 'sum',                 # Combine the durations
        'Action1Name': 'first',            # Keep the first task (assumes it's the same for all rows)
        'Action2Name': 'first',            # Keep the first page (assumes it's the same for all rows)
        'Correct': 'first',                # Keep the first success status (assumes it's consistent)
        'Correct': lambda x: (~x).sum()   # Count errors (assuming Correct is a boolean)
    }).rename(columns={'Correct': 'Errors'})  # Rename the column to Errors

    # Add user and system columns
    df['user'] = user
    df['system'] = system
    return df

# List of files to process
files = [
    (f"./logs/{user}_{system}_task_log.csv", user, system)
    for user in users
    for system in systems
]

# Process and combine all files
all_data = pd.concat([process_file(f[0], f[1], f[2]) for f in files], ignore_index=True)

# Drop timestamp columns
all_data = all_data.drop(columns=['StartTime', 'EndTime'], errors='ignore')

# Reorder columns to have 'user' and 'system' first
columns_order = ['user', 'system'] + [col for col in all_data.columns if col not in ['user', 'system']]
all_data = all_data[columns_order]

# Save the combined file
output_path = "./logs/combined_task_log.csv"
all_data.to_csv(output_path, index=False)
print(f"Combined file saved to {output_path}")
