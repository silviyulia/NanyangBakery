import time

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


def test_login_waitres():
    driver = webdriver.Chrome(
        service=Service(ChromeDriverManager().install())
    )

    driver.maximize_window()

    try:
        driver.get("http://localhost:3000/login")

        wait = WebDriverWait(driver, 10)

        wait.until(
            EC.presence_of_element_located((By.ID, "email"))
        ).send_keys("kasir@gmail.com")    

        driver.find_element(By.ID, "password").send_keys("kasir")  

        driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

        wait.until(EC.url_contains("/kasir"))

        # Verifikasi
        assert "/kasir" in driver.current_url

    finally:
        time.sleep(5) 
        driver.quit()