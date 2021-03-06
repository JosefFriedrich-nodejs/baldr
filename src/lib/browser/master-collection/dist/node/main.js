"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const master_collection_1 = require("./master-collection");
const master_quote_1 = require("@bldr/master-quote");
const master_generic_1 = require("@bldr/master-generic");
const masterCollection = new master_collection_1.MasterCollection();
masterCollection.createMasterBySpec(master_quote_1.default);
masterCollection.createMasterBySpec(master_generic_1.default);
exports.default = masterCollection;
