import { useEffect, useState } from "react"
import InitialForm from "./components/PrincipalDebtor/InitialForm"
import DPForm from "./components/PrincipalDebtor/DPForm"
import FormContainer from "./components/FormContainer"
import SignatureUrl from "./components/Signature/SignatureUrl"
import { Route, Routes } from "react-router-dom"
import SignDocument from "./components/DocumentSign/SignDocument"
import SignedDocument from "./components/Alerts/SignedDocument"
import DSForm from "./components/JointDebtor/DSForm"

function App() {
    return (
      <Routes>
        <Route path="/" element={<FormContainer />} />
        <Route path="/joint_debtor/:id_request" element={<DSForm/>}/>
        <Route path="/sign/:id_request/:document/:cellphone" element={<SignatureUrl/>} />
        <Route path="/check_sign" element={<SignDocument/>} />
        <Route path="/signed_document" element={<SignedDocument/>} />
      </Routes>
    )
}

export default App
