const NotificationLoading = () => {
    return (
        <div className="w-full flex items-center px-5 py-2 cursor-pointer gap-5">
            <div className="animate-pulse min-w-[32px] w-8 h-8 bg-slate-700 rounded-full"></div>
            <div className="w-full flex items-center justify-between gap-5">
                <div className="w-full">
                    <p className="animate-pulse lg:w-[600px] md:mw-[500px] sm:w-[400px] w-[200px] h-5 bg-slate-700 rounded-md"></p>
                    <p className="animate-pulse w-14 h-5 bg-slate-700 px-2 py-1 rounded-full mt-2"></p>
                </div>
            </div>
        </div>
    );
};

export default NotificationLoading;
