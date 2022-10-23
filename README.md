<------------ Router ------------>
1) (POST)(email,password) api/auth/login
2) (POST)(first_name,last_name,email,password) api/auth/register
3) (GET) api/auth/activeemail/:email ???
4) (POST)(email) api/auth/forgetpassword
5) (GET) api/auth/verifyforgetpassword/:email ???
6) (POST)(password,password) api/auth/changepassword
7) (POST)(password,password) api/auth/resetpassword

<------------ Message after login ------------>
8) (GET) api/user/livreur/me
9) (GET) api/user/manager/me
10) (GET) api/user/client/me

