import { format } from 'date-fns';
import React, { useState } from 'react';
import AppointmentOption from './AppointmentOption';
import BookingModal from '../BookingModal/BookingModal';
import { useQuery } from 'react-query';
import Loading from '../../Shared/Loading/Loading';

const AvailableAppointment = ({selectedDate}) => {
    // const [appointmentOptions, setAppointmentOptions] = useState([]);
    const [treatment, setTreatment] = useState(null);
    const date = format(selectedDate, 'PP');

    const {data : appointmentOptions = [], refetch, isLoading} = useQuery({
        queryKey: ['appointmentOptions', date],
        queryFn: async() =>{ 
            const res =await fetch(`https://doctors-portal-server-0mahdi.vercel.app/appointmentOptions?date=${date}`);
            const data = await res.json();
            return data
        }
    })

    if (isLoading) {
        return <Loading></Loading>
    }

    // useEffect( () =>{
    //     fetch('https://doctors-portal-server-0mahdi.vercel.app/appointmentOptions')
    //     .then(res => res.json())
    //     .then(data => setAppointmentOptions(data))

    // },[])

    return (
        <section className='my-16'>
            <p className='text-center text-secondary font-bold'>
                Available Appointment on {format(selectedDate, 'PP')}
            </p>
            <p className='text-center text-secondary font-bold'>
                Please select a service.
            </p>
            <div className='grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-6'>
                {
                    appointmentOptions.map(option => <AppointmentOption
                        key={option._id}
                        appointmentOption={option}
                        setTreatment={setTreatment}
                    ></AppointmentOption>)
                }
            </div>
            {
                treatment && 
                <BookingModal
                    selectedDate = {selectedDate}
                    treatment={treatment}
                    setTreatment = {setTreatment}
                    refetch={refetch}
                ></BookingModal>
            }
        </section>
    );
};

export default AvailableAppointment;