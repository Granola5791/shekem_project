package main

func login(username string, password string) {
	if !IsValidPassword(password) {
		println("Invalid password") // implement this
		return
	}

	if !UserExistsInDB(username) {
		println("Invalid username or password") // implement this
		return
	}

	hashedPassword := GetUserHashedPasswordFromDB(username)
	salt := GetUserSaltFromDB(username)
	if !VerifyPassword(hashedPassword, password, salt) {
		println("Invalid username or password") // implement this
		return
	}

	if GetUserRoleFromDB(username) == "admin" {
		println("Admin logged in") // implement this
	} else {
		println("User logged in") // implement this
	}
}

func CreateNewHashedPassword(password string) (string, string) {
	salt := GenerateSalt()
	hashedPassword := hashPassword(password, salt)
	return hashedPassword, salt
}

func IsValidPassword(password string) bool {
	var passwordLength int = len(password)
	if passwordLength < 8 {
		println("Password must be at least 8 characters long")
		return false
	}
	if passwordLength > 30 {
		println("Password must not exceed 30 characters")
		return false
	}
	return true
}
