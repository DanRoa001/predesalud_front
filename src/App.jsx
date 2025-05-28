import { useEffect, useState } from "react"
import { Route, Routes } from "react-router-dom"
import FormContainer from "./components/PersonOperations/FormContainer"
import CheckInfo from "./components/PersonOperations/CheckInfo/CheckInfo"

import SignatureUrl from "./components/RequestOperations/Signature/SignatureUrl"
import SignDocument from "./components/RequestOperations/DocumentSign/SignDocument"
import SignedDocument from "./components/RequestOperations/Alerts/SignedDocument"
import StartRequest from "./components/RequestOperations/StartRequest/StartRequest"
import CheckRequest from "./components/RequestOperations/CheckRequest"
import Layout from "./components/Layout/Layout"

function App() {
    return (
      <Routes >
          <Route element={<Layout/>}>
              <Route path="/" element={<CheckInfo/>} />
              <Route path="/register" element={<FormContainer/>} /> 

              <Route path="/start_request" element={<StartRequest/>}/>
              <Route path="/check_request"element={<CheckRequest/>}/>
              <Route path="/sign/:id_request/:document/:cellphone" element={<SignatureUrl/>} />
              <Route path="/check_sign" element={<SignDocument/>} />
              <Route path="/signed_document" element={<SignedDocument/>} />
          </Route>      
      </Routes>
    )
}

export default App
