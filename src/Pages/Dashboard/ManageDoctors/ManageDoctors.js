import React, { useState } from 'react';
import { useQuery } from 'react-query';
import Loading from '../../Shared/Loading/Loading';
import ConfirmationModal from '../../Shared/ConfirmationModal/ConfirmationModal';
import { toast } from 'react-hot-toast';

const ManageDoctors = () => {
    const [deletingDoctor, setDeletingDoctor] = useState(null);

    const closeModal = () =>{
        setDeletingDoctor(null);
    }

    const {data: doctors, isLoading, refetch} = useQuery({
        queryKey: ['doctors'],
        queryFn: async () =>{
            try{
                const res  = await fetch('https://doctors-portal-server-0mahdi.vercel.app/doctors', {
                    headers: {
                        authorization: `bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                const data = await res.json();
                return data;
            }
            catch(error){

            }
        }
    });

    const handleDeleteDoctor = doctor => {
        fetch(`https://doctors-portal-server-0mahdi.vercel.app/doctors/${doctor._id}`, {
            method: 'DELETE',
            headers: {
                authorization: `bearer ${localStorage.getItem('accessToken')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.deletedCount > 0) {
                refetch();
                toast.success(`Doctor ${doctor.name} deleted successfully`)
            }
        })
    }

    if(isLoading){
        return <Loading></Loading>
    }

    return (
        <div>
            <h2 className="text-3xl">Manage Doctors: {doctors?.length}</h2>
            <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                    <tr>
                        <th></th>
                        <th>Avatar</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Specialty</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                        {
                            doctors?.map((doctor, i) => <tr key={doctor._id}>
                            <th>{i + 1}</th>
                            <td><div className="avatar">
                                <div className="w-24 rounded-full">
                                    <img src={doctor.image} alt=''/>
                                </div>
                                </div>
                            </td>
                            <td>{doctor.name}</td>
                            <td>{doctor.email}</td>
                            <td>{doctor.specialty}</td>
                            <td>
                                <label onClick={() => setDeletingDoctor(doctor)} className="btn btn-sm btn-error" htmlFor="confirmation-modal">Delete</label>
                            </td>
                        </tr>)
                        }
                    </tbody>
                </table>
            </div>
            {
                deletingDoctor && <ConfirmationModal
                    title={`Are You sure You Want To delete`}
                    message={`If you delete ${deletingDoctor.name}. It cannot be undone.`}
                    successAction ={handleDeleteDoctor}
                    successButtonName = "Delete"
                    modalData = {deletingDoctor}
                    closeModal = {closeModal}
                ></ConfirmationModal>
            }
        </div>
    );
};

export default ManageDoctors;