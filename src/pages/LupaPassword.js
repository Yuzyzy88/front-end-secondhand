import React, { useState } from "react"
import { Button, Form } from "react-bootstrap"
import { UserAuth } from "../context/AuthContext"

import "bootstrap/dist/css/bootstrap.min.css"

const LupaPassword = () => {
  const [error, setError] = useState(false)
  const [email, setEmail] = useState("")
  const { updatePassword } = UserAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await updatePassword(email)
    } catch (e) {
      setError(e.message)
      console.log(e.message)
    }
  }

  return (
    <div className="container-fluid">
      <div className="row align-items-center">
        <div className="col-lg-6 col-md-12 p-0">
          <img
            className="img-fluid icon"
            src="/img/bg.png"
            alt=""
            width="100%"
            style={{ height: "967px" }}
          />
        </div>
        <div className="col-lg-6 col-md-12 col-xs-12 pt-5 pb-5">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6 col-xs-12">
              <Form className="sign">
                <h4 className="pb-2 fw-bold">Reset Password</h4>
                <p className="small">
                  Email verifikasi akan dikirim ke email Anda. Silahkan masukkan
                  email Anda!
                </p>
                <fieldset>
                  <Form.Control
                    className="inputBasic"
                    id="email"
                    placeholder="Contoh: johndee@gmail.com"
                    onChange={(e) => setEmail(e.target.value)}

                  />
                  <div className="d-grid gap-2 mb-4">
                    <Button
                      type="submit"
                      className="btn-sign text-center"
                      onClick={handleSubmit}
                    >
                      Kirim
                    </Button>
                  </div>
                </fieldset>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LupaPassword
