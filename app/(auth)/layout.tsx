

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="h-screen w-full flex items-center justify-center bg-slate-500 bg-cover"
      style={{
        backgroundImage:
          "url(https://res.cloudinary.com/dad0fircy/image/upload/v1693150419/discord-clone/discord-auth.png)",
      }}
    >
      <div>{children}</div>
    </div>
  );
};

export default AuthLayout;
