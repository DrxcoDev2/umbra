use serde::Deserialize;

#[derive(Deserialize, Debug)]
struct Login {
    username: String,
    password: String,
}

fn parse_login(input: &str) -> Result<Login, serde_json::Error> {
    serde_json::from_str(input)
}

fn main() {
    let json_input = r#"
        {
            "username": "nilx",
            "password": "supersegura123"
        }
    "#;

    match parse_login(json_input) {
        Ok(login) => println!("Login válido: {:?}", login),
        Err(e) => eprintln!("Error al parsear: {}", e),
    }
}
