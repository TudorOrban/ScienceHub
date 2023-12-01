use std::fmt;

// Define a custom error type
#[derive(Debug)]
pub struct MyError {
    message: String,
}
 
impl MyError {
    pub fn new(msg: &str) -> MyError {
        MyError {
            message: msg.to_string(),
        }
    }
}

impl fmt::Display for MyError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}", self.message)
    }
}

impl std::error::Error for MyError {}