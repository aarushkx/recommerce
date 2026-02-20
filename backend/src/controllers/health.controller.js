export const health = (req, res) => {
    try {
        res.status(200).json({ message: "OK" });
    } catch (error) {
        console.log("ERROR :: CONTROLLER :: health :: ", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
