const House = require('../models/House');

async function getAll(){
    return await House.find({}).lean();
}

async function getOne(id){
    return await House.findById(id).lean();
}

async function getTopListings(){
    return await House.find().sort({createdAt:-1}).limit(3).lean();
}


async function rentHouse(userId,houseId){
    const house = await House.findById(houseId);
    house.rentedHome.push(userId);
    house.availablePieces--;
    return await house.save();
}

async function createHouse(houseData){
    let house =  new House(houseData);
    return await house.save();
}

async function editHouse(houseId, houseData){
    return await House.updateOne({_id: houseId}, houseData, { runValidators: true })
}

async function deleteHouse(id){
    return await House.findByIdAndDelete(id);
}

async function getHouseByHousingType(type){
    return await House.find().where("type").equals(type).lean();
}


module.exports = {
    getAll,
    getOne,
    createHouse,
    editHouse,
    deleteHouse,
    rentHouse,
    getTopListings,
    getHouseByHousingType
}

