import { useEffect, useState } from "react"
import DPForm from "./PrincipalDebtor/DPForm"
import { useParams, useSearchParams } from "react-router-dom"
import { crediexpressAPI } from "../../api/axiosClient"
import DSForm from "./JointDebtor/DSForm"
import { toast } from "react-toastify"


function FormContainer() {

    const [searchParams] = useSearchParams()
    const isEditMode = searchParams.get("edit") === "true";
    const idPerson = searchParams.get("id");

    const [idRequestDS,setIDRequestDS] = useState("")

    const [personData, setPersonData] = useState(null);
    const [requestData,setRequestData] = useState(null)
    const [hasOpenRequest,setHasOpenRequest] = useState(true)
    const [status,setStatus] = useState("")

    useEffect(() => {

      if (isEditMode && idPerson) {
        const retrievePerson = async() => {
            try {
              const fetchData = await crediexpressAPI.post("/func/find_person", {
                id_person : idPerson
              })

              setPersonData(fetchData.data.person_data)
              setRequestData(fetchData.data.request)
              setHasOpenRequest(fetchData.data.has_open_request)
            } catch (error) {
                toast.error(error.response?.data?.error)
            }
        }

        retrievePerson()
      }

    }, [isEditMode, idPerson]);


    return (
        <>
          <div>

              {status == "joint_debtor" ? (
                <DSForm id_request={idRequestDS}/>
              ) : (
                <DPForm person_data={personData}
                        request={requestData}
                        hasOpenRequest={hasOpenRequest}
                        setIDRequestDS={setIDRequestDS} 
                        setStatus={setStatus}/>
              )}

          </div>
        </>
    )
}

export default FormContainer
