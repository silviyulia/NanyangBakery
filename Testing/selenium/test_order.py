import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


def test_waitres_order():

    driver = webdriver.Chrome()
    wait = WebDriverWait(driver, 10)

    driver.get("http://localhost:3000/login")
    driver.maximize_window()

    # LOGIN

    wait.until(
        EC.presence_of_element_located((By.NAME, "email"))
    ).send_keys("waitres@gmail.com")

    driver.find_element(By.NAME, "password").send_keys("waitres")

    driver.find_element(By.TAG_NAME, "button").click()


    wait.until(
        EC.url_contains("/waitres")
    )


    meja = wait.until(
        EC.element_to_be_clickable(
            (By.XPATH, "//button[contains(text(),'1')]")
        )
    )

    meja.click()

    tombol_tambah = wait.until(
        EC.element_to_be_clickable(
            (
                By.XPATH,
                "(//button[contains(text(),'Tambah')])[1]"
            )
        )
    )

    tombol_tambah.click()

    time.sleep(1)


    kirim = wait.until(
        EC.element_to_be_clickable(
            (
                By.XPATH,
                "//button[contains(text(),'Kirim')]"
            )
        )
    )

    kirim.click()


    alert = wait.until(EC.alert_is_present())

    assert "berhasil" in alert.text.lower()

    alert.accept()

    driver.quit()