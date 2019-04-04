
class controller{
    static welcome(req, res)  {
    return res.status(200).json({
    message: 'welcome To my Banka app',
    });
    }
    }
    
    export default controller