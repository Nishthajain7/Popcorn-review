// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";

// export default NextAuth({
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         user: {
//           label: "Username",
//           type: "text",
//         },
//         password: {
//           label: "Password",
//           type: "password",
//         },
//       },
//       async authorize(credentials) {
//         // Replace with your own logic to authenticate the user
//         if (credentials?.user === "test" && credentials.password === "password") {
//           return { id: "1", name: "Test User" };
//         }
//         return null;
//       },
//     }),
//   ],
//   pages: {
//     error: '/auth/error', // Custom error page (optional)
//   },
//   session: {
//     strategy: "jwt",
//   },
// });
