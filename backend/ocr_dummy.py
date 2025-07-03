import random
def extract_text(cropped_image):
    dummy_plate_numbers =[
        "BA 2 PA 3456",
        "BA 1 KA 1234",
        "BA 3 JA 5678",
        "BA 4 NA 9101",
        "BA 5 GA 2345",
        "BA 6 TA 6789",
        "BA 7 DA 1122",
        "BA 8 LA 3344",
        "BA 9 PA 5566",
        "BA 7 DA 1122",
        "BA 8 LA 3344",
        "BA 9 PA 5566",
        "BA 10 MA 7788",
        "BA 11 RA 9900",
        "BA 12 SA 4455",
        "BA 13 JA 6677",
        "BA 14 GA 8899",
        "BA 15 NA 2233",
        "BA 16 TA 4455",
        "BA 17 DA 6677",
        "BA 18 LA 8899",
        "BA 19 PA 3344",
        "BA 20 MA 5566"
    ]
    return random.choice(dummy_plate_numbers)