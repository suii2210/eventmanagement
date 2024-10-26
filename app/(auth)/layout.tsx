const Layout = ({children} : { children:React.ReactNode }) => {
    return(
        <div className="flex-center min-h-screen w-full bg-dotted-spacing-4  bg-dotted-pattern bg-cover bg-fixed bg-center ">
            {children}
        </div>
    )
}

export default Layout;