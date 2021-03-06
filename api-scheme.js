//REJESTRACJA
POST = {
    request: {
        uri: "zpi/api/registration",
        headers: {
            "Content-Type": "application/json"
        },
        body: {
            name: "String",
            email: "String",
            password: "String"
        }
    },
    response: {
        body: {
            id: "Integer",
            name: "String",
            email: "String"
        }
    },
    errors: {
        400: [
            "This email is already taken"
        ]
    }
};

//LOGOWANIE
POST = {
    request: {
        uri: "zpi/api/login",
        headers: {
            "Content-Type": "application/json"
        },
        body: {
            email: "String",
            password: "String"
        }
    },
    response: {
        headers: {
            "x-auth-token": "JWT"
        },
        body: {
            id: "Integer",
            name: "String",
            photo: "String",
            about: "String",
            email: "String",
            phone_number: "String",
            facebook: "String",
            instagram: "String",
            telegram: "String",
            city: "String",
            address: "String"
        }
    },
    errors: {
        400: [
            "Wrong username or password"
        ]
    }
}

//PROFIL UŻYTKOWNIKA
//EDYCJA DANYCH UŻYTKOWNIKA
//USUNIĘCIE UŻYTKOWNIKA
GET = {
    request: {
        uri: "zpi/api/user/:id",
        headers: {
            "x-auth-token": "JWT"
        }
    },
    response: {
        body: {
            id: "Integer",
            name: "String",
            photo: "String",
            about: "String",
            email: "String",
            phone_number: "String",
            facebook: "String",
            instagram: "String",
            telegram: "String",
            city: "String",
            address: "String",
        }
    },
    errors: {
        401: [
            "Unauthorized"
        ],
        404: [
            "User with the given id was not found"
        ]
    }
}
PUT = {
    request: {
        uri: "zpi/api/user/:id",
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": "JWT"
        },
        body: {
            name: "String",
            photo: "String",
            about: "String",
            email: "String",
            phone_number: "String",
            facebook: "String",
            instagram: "String",
            telegram: "String",
            city: "String",
            address: "String",
        }
    },
    response: {
        body: {
            id: "Integer",
            name: "String",
            photo: "String",
            about: "String",
            email: "String",
            phone_number: "String",
            facebook: "String",
            instagram: "String",
            telegram: "String",
            city: "String",
            address: "String",
        }
    },
    errors: {
        400: [
            "Bad request"
        ],
        401: [
            "Unauthorized"
        ],
        403: [
            "Forbidden"
        ],
        404: [
            "User with the given id was not found"
        ]
    }
}
DELETE = {
    request: {
        uri: "zpi/api/user/me",
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": "JWT"
        }
    },
    response: {
        body: {
            id: "Integer",
            name: "String",
            photo: "String",
            about: "String",
            email: "String",
            phone_number: "String",
            facebook: "String",
            instagram: "String",
            telegram: "String",
            city: "String",
            address: "String",
        }
    },
    errors: {
        401: [
            "Unauthorized"
        ],
        403: [
            "Forbidden"
        ],
        404: [
            "User with the given id was not found"
        ]
    }
}

//OGŁOSZENIE
//DODANIE OGŁOSZENIA
//EDYCJA OGŁOSZENIA
//USUNIĘCIE OGŁOSZENIA
GET = {
    request: {
        uri: "zpi/api/advertisement/:id",
        headers: {
            "x-auth-token": "JWT"
        }
    },
    response: {
        body: {
            id: "Integer",
            title: "String",
            animal_type: "String",
            sex: "String",
            size: "String",
            age: "String",
            color: "String",
            breed: "String",
            cost_of_living: "String",
            description: "String",
            vaccines: "String",
            allergies: "String",
            parasites: "String",
            health_status: "String",
            illness_description: "String",
            behavioral_disorders: "Boolean",
            behavioral_disorders_description: "String",
            city: "String",
            publisher_id: "Integer",
            modified_date: "Integer",
            due_date: "Integer",
            is_active: "Boolean",
            photos: "String[]"
        }
    },
    errors: {
        401: [
            "Unauthorized"
        ],
        404: [
            "User with the given id was not found"
        ]
    }
}
POST = {
    request: {
        uri: "zpi/api/advertisement",
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": "JWT"
        },
        body: {
            title: "String",
            animal_type: "String",
            sex: "String",
            size: "String",
            age: "String",
            color: "String",
            breed: "String",
            cost_of_living: "String",
            description: "String",
            vaccines: "String",
            allergies: "String",
            parasites: "String",
            health_status: "String",
            illness_description: "String",
            behavioral_disorders: "Boolean",
            behavioral_disorders_description: "String",
            city: "String",
            photos: "String[]"
        }
    },
    response: {
        body: {
            id: "Integer",
            title: "String",
            animal_type: "String",
            sex: "String",
            size: "String",
            age: "String",
            color: "String",
            breed: "String",
            cost_of_living: "String",
            description: "String",
            vaccines: "String",
            allergies: "String",
            parasites: "String",
            health_status: "String",
            illness_description: "String",
            behavioral_disorders: "Boolean",
            behavioral_disorders_description: "String",
            city: "String",
            publisher_id: "Integer",
            modified_date: "Integer",
            due_date: "Integer",
            is_active: "Boolean",
            photos: "String[]"
        }
    },
    errors: {
        400: [
            "Bad request"
        ],
        401: [
            "Unauthorized"
        ]
    }
}
PUT = {
    request: {
        uri: "zpi/api/advertisement/:id",
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": "JWT"
        },
        body: {
            title: "String",
            animal_type: "String",
            sex: "String",
            size: "String",
            age: "String",
            color: "String",
            breed: "String",
            cost_of_living: "String",
            description: "String",
            vaccines: "String",
            allergies: "String",
            parasites: "String",
            health_status: "String",
            illness_description: "String",
            behavioral_disorders: "Boolean",
            behavioral_disorders_description: "String",
            city: "String",
            photos: "String[]"
        }
    },
    response: {
        body: {
            id: "Integer",
            title: "String",
            animal_type: "String",
            sex: "String",
            size: "String",
            age: "String",
            color: "String",
            breed: "String",
            cost_of_living: "String",
            description: "String",
            vaccines: "String",
            allergies: "String",
            parasites: "String",
            health_status: "String",
            illness_description: "String",
            behavioral_disorders: "Boolean",
            behavioral_disorders_description: "String",
            city: "String",
            publisher_id: "Integer",
            modified_date: "Integer",
            due_date: "Integer",
            is_active: "Boolean",
            photos: "String[]"
        }
    },
    errors: {
        400: [
            "Bad request"
        ],
        401: [
            "Unauthorized"
        ],
        403: [
            "Forbidden"
        ],
        404: [
            "User with the given id was not found"
        ]
    }
}
DELETE = {
    request: {
        uri: "zpi/api/advertisement/:id",
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": "JWT"
        }
    },
    response: {
        body: {
            id: "Integer",
            title: "String",
            animal_type: "String",
            sex: "String",
            size: "String",
            age: "String",
            color: "String",
            breed: "String",
            cost_of_living: "String",
            description: "String",
            vaccines: "String",
            allergies: "String",
            parasites: "String",
            health_status: "String",
            illness_description: "String",
            behavioral_disorders: "Boolean",
            behavioral_disorders_description: "String",
            city: "String",
            publisher_id: "Integer",
            modified_date: "Integer",
            due_date: "Integer",
            is_active: "Boolean",
            photos: "String[]"
        }
    },
    errors: {
        401: [
            "Unauthorized"
        ],
        403: [
            "Forbidden"
        ],
        404: [
            "advertisement with the given id was not found"
        ]
    }
}

//ZGŁOSZENIE NARUSZENIA ZASAD
//PRZEGLĄD ZGŁOSZEŃ:ADMIN
//EDYCJA ZGŁOSZEŃ:ADMIN
POST = {
    request: {
        uri: "zpi/api/violation",
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": "JWT"
        },
        body: {
            advertisement: "Integer",
            reason: "String",
            comment: "String",
        }
    },
    response: {
        body: {
            id: "Integer",
            reporter: "Integer",
            advertisement: "Integer",
            reason: "String",
            comment: "String",
            status: "String"
        }
    },
    errors: {
        400: [
            "Bad request"
        ],
        401: [
            "Unauthorized"
        ]
    }
}

//ZAKŁADKI
//DODANIE DO ZAKŁADEK
//USUNIĘCIE Z ZAKŁADEK
GET = {
    request: {
        uri: "zpi/api/bookmarks",
        headers: {
            "x-auth-token": "JWT"
        }
    },
    response: {
        body: "Advertisement[]"
    },
    errors: {
        401: [
            "Unauthorized"
        ]
    }
}
POST = {
    request: {
        uri: "zpi/api/bookmarks",
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": "JWT"
        },
        body: {
            advertisement_id: "Integer"
        }
    },
    response: {
        body: {
            user_id: "Integer",
            advertisement_id: "Integer"
        }
    },
    errors: {
        400: [
            "Bad request"
        ],
        401: [
            "Unauthorized"
        ]
    }
}
DELETE = {
    request: {
        uri: "zpi/api/bookmarks/:id",
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": "JWT"
        }
    },
    response: {
        body: {
            user_id: "Integer",
            advertisement_id: "Integer"
        }
    },
    errors: {
        401: [
            "Unauthorized"
        ],
        404: [
            "This advertisement was not bookmarked"
        ]
    }
}

//LISTA OGŁOSZEŃ
//WYSZUKIWANIE OGŁOSZEŃ
GET = {
    request: {
        uri: "zpi/api/advertisement",
        headers: {
            "x-auth-token": "JWT"
        }
    },
    response: {
        body: "Advertisement[]"
    }
}

GET = {
    request: {
        uri: "zpi/api/advertisement?query",
        headers: {
            "x-auth-token": "JWT"
        }
    },
    response: {
        body: "Advertisement[]"
    }
}

//LISTA MIAST
GET = {
    request: {
        uri: "zpi/api/cities"
    },
    response: {
        body: "String"
    }
}
GET = {
    request: {
        uri: "zpi/api/cities/:id"
    },
    response: {
        body: "String[]"
    }
}