use serde_json::{Value};

use crate::types::{TextDiff, WorkSnapshot, DeltaData};


pub fn apply_text_diffs(mut original: String, text_diffs: Vec<TextDiff>) -> String {
    let mut original_chars: Vec<char> = original.chars().collect();
    let mut operation_offset = 0;

    for TextDiff { position, delete_count, insert } in text_diffs {
        let adjusted_position = ((position as isize) + operation_offset).max(0) as usize;

        // Perform deletion
        if delete_count > 0 {
            let end = adjusted_position + delete_count as usize;
            if end <= original_chars.len() {
                original_chars.drain(adjusted_position..end);
                operation_offset -= delete_count as isize;
            }
        }

        // Perform insertion
        if !insert.is_empty() {
            for ch in insert.chars().rev() {
                if adjusted_position <= original_chars.len() {
                    original_chars.insert(adjusted_position, ch);
                }
            }
            operation_offset += insert.len() as isize;
        }
    }

    original_chars.into_iter().collect()
}

pub fn apply_deltas_to_work_snapshot(snapshot: &mut WorkSnapshot, deltas: DeltaData) {
    // Attempt to serialize snapshot_data to JSON, log error and return if unsuccessful
    let snapshot_data_value = match serde_json::to_value(&snapshot.snapshot_data) {
        Ok(value) => value,
        Err(e) => {
            eprintln!("Error serializing snapshot data: {:?}", e);
            return;
        }
    };

    let mut snapshot_json = match snapshot_data_value.as_object() {
        Some(obj) => obj.clone(),
        None => {
            eprintln!("Snapshot data is not a JSON object");
            return;
        }
    };

    // Apply deltas to the JSON representation
    for (field, text_diffs) in deltas {
        if let Some(value) = snapshot_json.get_mut(&field) {
            if let Some(str_val) = value.as_str() {
                let modified_str = apply_text_diffs(str_val.to_string(), text_diffs);
                snapshot_json.insert(field.to_string(), Value::String(modified_str));
            }
        }
    }

    // Attempt to deserialize the modified JSON back to Work, log error and return if unsuccessful
    match serde_json::from_value(Value::Object(snapshot_json)) {
        Ok(data) => snapshot.snapshot_data = data,
        Err(e) => {
            eprintln!("Error deserializing snapshot data: {:?}", e);
        }
    }
}
