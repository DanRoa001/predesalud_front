import { useEffect, useState } from "react"
import DPForm from "./PrincipalDebtor/DPForm"
import { useParams, useSearchParams } from "react-router-dom"
import { crediexpressAPI } from "../../api/axiosClient"
import DSForm from "./JointDebtor/DSForm"


function FormContainer() {

    const [searchParams] = useSearchParams()
    const isEditMode = searchParams.get("edit") === "true";
    const idPerson = searchParams.get("id");

    const [personData, setPersonData] = useState(null);
    const [status,setStatus] = useState("")

    useEffect(() => {
      if (isEditMode && idPerson) {

        const retrievePerson = async() => {
          const fetchData = await crediexpressAPI.post("/func/find_person", {
            id_person : idPerson
          })
          setPersonData(fetchData.data)
        }

        retrievePerson()

      }
    }, [isEditMode, idPerson]);


    return (
        <>
          <div>

              {status == "joint_debtor" ? (
                <DSForm/>
              ) : (
                <DPForm person_data={personData} 
                        setStatus={setStatus}/>
              )}

          </div>
        </>
    )
}

export default FormContainer
