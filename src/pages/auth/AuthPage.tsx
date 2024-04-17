// import { UserLogin } from '../../types/user';
// import Logo from '../../assets/img/logo.svg';
// import { useContext, useEffect, useState } from 'react';
// import { FirebaseContext } from '../../contexts/firebase-context';
// import UserService from '../../services/user.service';
// import { useNavigate } from 'react-router-dom';
// import { useAtom } from 'jotai';
// import { UserAtom } from '../../stores/userStore';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { FcGoogle } from 'react-icons/fc';
// import { useForm } from 'react-hook-form';
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// import { useToast } from '@/components/ui/use-toast';
// import { ReloadIcon } from '@radix-ui/react-icons';

// const modes = {
//   login: 'login',
//   signup: 'signup',
// };

// const formSchema = z.object({
//   name: z.string().min(2).max(50).optional(),
//   email: z
//     .string()
//     .email()
//     .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
//   password: z
//     .string()
//     .min(8)
//     .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$.!%*#?&]{8,}$/),
// });

// export default function AuthPage() {
//   const [initiated, setInitiated] = useState<boolean>(false);
//   const [mode, setMode] = useState<keyof typeof modes>('login');
//   const [loginLoading, setLoginLoading] = useState<boolean>(false);

//   const firebaseContext = useContext(FirebaseContext);
//   const [user, setUser] = useAtom(UserAtom);

//   const navigate = useNavigate();
//   const { toast } = useToast();

//   useEffect(() => {
//     if (user && !alert) {
//       navigate('/');
//     } else {
//       setInitiated(true);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: '',
//       email: '',
//       password: '',
//     },
//   });

//   const onSubmit = async (values: z.infer<typeof formSchema>) => {
//     setLoginLoading(true);
//     try {
//       if (values.name) {
//         await UserService.signUp(firebaseContext.auth, firebaseContext.firestore, values as UserLogin);
//         toast({
//           title: 'Success!',
//           description: 'Sign up successfull! Now, enter your email and verify your account',
//         });
//       } else {
//         const user = await UserService.login(firebaseContext.auth, firebaseContext.firestore, values as UserLogin);
//         toast({
//           title: 'Login successful!',
//         });
//         setUser(user);
//       }
//     } catch (error) {
//       toast({
//         title: 'An error occurred',
//         description: error as string,
//       });
//     } finally {
//       setLoginLoading(false);
//     }
//   };

//   const googleLogin = async () => {
//     setLoginLoading(true);
//     try {
//       const user = await UserService.googleLogin(firebaseContext.auth, firebaseContext.firestore);
//       toast({
//         title: 'Login successful!',
//       });
//       setUser(user);
//     } catch (error) {
//       toast({
//         title: 'An error occurred',
//         description: error as string,
//       });
//     } finally {
//       setLoginLoading(false);
//     }
//   };

//   const changeMode = (newMode = '') => {
//     form.setValue('email', '');
//     form.setValue('password', '');
//     if (mode === 'login' || newMode === 'signup') {
//       setMode('signup');
//       form.setValue('name', '');
//     } else {
//       setMode('login');
//     }
//   };

//   return (
//     initiated && (
//       <div className="flex flex-col justify-center items-center content-center w-full h-full relative gap-10">
//         <img src={Logo} alt="logo" className="absolute mix-blend-color-burn top-5 left-5" />
//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit(onSubmit)}
//             className="w-[350px] flex flex-col items-stretch content-center justify-center gap-4"
//           >
//             {mode === 'signup' && (
//               <FormField
//                 control={form.control}
//                 name="name"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Nome</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Nome" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             )}
//             <FormField
//               control={form.control}
//               name="email"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Email</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Email" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="password"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Password</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Password" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             {loginLoading ? (
//               <Button disabled>
//                 <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
//                 Carregando
//               </Button>
//             ) : (
//               <Button type="submit" className="!mt-5 w-fit self-center">
//                 Continuar
//               </Button>
//             )}
//           </form>
//         </Form>
//         <div className="flex items-center content-center justify-center gap-4 w-[500px]">
//           <div className="h-px flex-1 bg-neutral-500"></div>
//           <span>ou</span>
//           <div className="h-px flex-1 bg-neutral-500"></div>
//         </div>
//         <Button onClick={googleLogin} className="w-[350px] bg-white text-black hover:bg-neutral-50 gap-3">
//           <FcGoogle className="h-5 w-5" /> Continuar com o Google
//         </Button>
//         {mode === 'login' ? (
//           <Button variant="link" onClick={() => changeMode('signup')}>
//             Não tem uma conta ainda? Registre-se agora
//           </Button>
//         ) : (
//           <Button variant="link" onClick={() => changeMode('login')}>
//             Já tem uma conta? Acesse agora
//           </Button>
//         )}
//       </div>
//     )
//   );
// }
