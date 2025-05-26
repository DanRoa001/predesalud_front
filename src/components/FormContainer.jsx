import { useEffect, useState } from "react"
import InitialForm from "./PrincipalDebtor/InitialForm"
import DPForm from "./PrincipalDebtor/DPForm"


function FormContainer() {

    const [status, setStatus] = useState("")
    const [documentNumber,setDocumentNumber] = useState("")

    return (
        <>
          <div>
              {status == "debtorRegister" && (
                <DPForm document_number={documentNumber}/>
              )}

              {status == "" && (
                <InitialForm setStatus={setStatus}  
                             setDocumentNumber={setDocumentNumber}/>
              )}
          </div>
        </>
    )
}

export default FormContainer
