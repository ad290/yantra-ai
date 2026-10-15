import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Router } from '../../app.routes';
import { getMeService, refreshService } from '../../features/auth/services/auth.api.service';
import { useAuthDispatch } from '../../features/auth/store/hooks';
import { clearUserData, setUserData } from '../../features/auth/store/user.slice';
import LoadingScreen from '../shared/LoadingScreen';

const bootstrapAuth = async () => {
    const token = await refreshService();
    if (!token) {
        throw new Error('Not authenticated');
    }
    return getMeService();
};

const AuthBootStrap = () => {
    const dispatch = useAuthDispatch();
    const [hydrated, setHydrated] = useState(false);
    const meQuery = useQuery({
        queryKey: ['auth', 'me'],
        queryFn: bootstrapAuth,
        retry: false,
    });

    useEffect(() => {
        if (meQuery.isPending) return;
        if (meQuery.isSuccess && meQuery.data) {
            dispatch(setUserData(meQuery.data));
        } else if (meQuery.isError) {
            dispatch(clearUserData());
        }
        setHydrated(true);
    }, [dispatch, meQuery.isPending, meQuery.isSuccess, meQuery.isError, meQuery.data]);

    if (meQuery.isPending || !hydrated) {
        return <LoadingScreen />;
    }
    return (
        <RouterProvider router={Router} />
    );
};

export default AuthBootStrap;
