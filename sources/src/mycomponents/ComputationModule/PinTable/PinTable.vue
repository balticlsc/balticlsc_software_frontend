<template>
    <div>
        
        <!-- The Modal for Declared Pin  -->
		<div class="modal" id="createDeclaredPin">
			<div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">

					<!-- Modal Header -->
					<div class="modal-header">
							<h4 class="modal-title">Create new declared pin ... </h4>
							<button type="button" class="close" data-dismiss="modal">&times;</button>
					</div>

					<!-- Modal body -->
					<div class="modal-body">
						<form>
							<div class="form-group">
								<label for="pin_name_id" >Name :</label>
								<input type="text" class="form-control" id="pin_name_id" 
										aria-describedby="emailHelp" placeholder="Enter name  ... ">
								<div class="invalid-feedback">A non empty name is required</div>
								<label id = "ivalid_name_lbl" v-show=" ! isPinNameValid" class = "text-danger">A non empty name is required !</label>
							</div>

							<!-- <div class="form-group"> -->
								
							<div class="form-group ">
								<label for="fset1">Binding : </label>
								<fieldset id="fset1">
									<!-- <legend>Binding : </legend> -->
									<div class="form-check-inline">
										<label class="form-check-label">
											<input class="form-check-input" type="radio" name="binding" id="binding_strong" value="0" checked> Required-Strong
										</label>
									</div>

									<div class="form-check-inline">
										<label class="form-check-label">
											<input class="form-check-input" type="radio" name="binding" id="binding_weak" value="1" > Required-Weak
										</label>
									</div>
									
									<div class="form-check-inline">
										<label class="form-check-label">
											<input class="form-check-input" type="radio" name="binding" id="binding_provided" value="2"> Provided
										</label>
									</div>
								</fieldset>
							</div>

							<div class="form-group ">
								<label for="fset2">Token Multiplicity : </label>
								<fieldset id="fset2">
									<!-- <legend>Binding : </legend> -->
									<div class="form-check-inline">
										<label class="form-check-label">
											<input class="form-check-input" type="radio" name="multiplicity" id="multiplicity_single" value="0" checked> Single
										</label>
									</div>
									<div class="form-check-inline">
										<label class="form-check-label">
											<input class="form-check-input" type="radio" name="multiplicity" id="multiplicity_multiple" value="1"> Multiple
										</label>
									</div>
								</fieldset>
							</div>

							<div class="form-group ">
								<label for="fset3">Data Multiplicity : </label>
								<fieldset id="fset3">
									<!-- <legend>Binding : </legend> -->
									<div class="form-check-inline">
										<label class="form-check-label">
											<input class="form-check-input" type="radio" name="dataMultiplicity" id="data_multiplicity_single" value="0" checked> Single
										</label>
									</div>
									<div class="form-check-inline">
										<label class="form-check-label">
											<input class="form-check-input" type="radio" name="dataMultiplicity" id="data_multiplicity_multiple" value="1"> Multiple
										</label>
									</div>
								</fieldset>
							</div>

							<div class="form-group">
								<label for="dataTypeSelect">Data Type : </label>
								<select class="form-control" id="dataTypeSelect" v-model="selectedDataType">
									<option disabled value="">Please select one</option>
									<option v-for=" opt_val in this.dataTypes" :value="opt_val.uid" :key="opt_val.uid"> 
										{{opt_val.name}}
									</option>
									
								</select>
							</div>
							
							<div class="form-group" v-show="shouldDataStructureBeVisible()">
								<label for="dataStructSelect">Data Structure : </label>
								<select class="form-control" id="dataStructSelect" v-model="selectedDataStructure">
									<option disabled value="">Please select one</option>
									<option v-for=" opt_val in this.dataStructures" :value="opt_val.uid" :key="opt_val.uid"> 
										{{opt_val.name}}
									</option>
									
								</select>
							</div>

							<div class="form-group">
								<label for="accTypeSelect">Access Type : </label>
								<select class="form-control" id="accTypeSelect" v-model="selectedAccessType">
									<option disabled value="">Please select one</option>
									<option v-for=" opt_val in this.accessTypes" :value="opt_val.uid" :key="opt_val.uid"> 
										{{opt_val.name}}
									</option>
									
								</select>
							</div>

						</form>
					</div>

					<!-- Modal footer -->
					<div class="modal-footer">
						<button type="button" class="btn btn-primary" @click="createDeclaredPin()">Create</button>
						<button type="button" class="btn btn-secondary"  data-dismiss="modal" data-target="#createDeclaredPin">Close</button>
					</div>

				</div>
			</div>
		</div>

        

        <div class="form-group row mr-2">
            <label class="font-weight-bold col-md-2 col-form-label text-right" >Pins : </label>

            <div class="col-md-10 card p-2 ">
                <div class = "form-row justify-content-end pr-2">
                    <!-- <button type="button" class="btn btn-info btn-sm pr-2" data-toggle="modal" data-target="#createDeclaredPin"> Add pin </button> -->
                    <button type="button" class="btn btn-info btn-sm pr-2" @click = "showAddPinModal()"> Add pin </button>
                </div>
                <label class="form-check-label" for="pinsTable">Pins:</label>

                <div class="table-responsive">
                    <table class="table table-condensed table-striped table-bordered" id="pinsTable">
                        <!-- <caption>Pins</caption> -->
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Binding</th>
                            <th>Token Multiplicity</th>
                            <th>Data Multiplicity</th>
                            <th>DataType</th>
                            <th>DataStructure</th>
                            <th>AccessType</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(pin,ind) in pins" >
                                <td> {{pin.name}} </td>
                                <td> {{bindingKindString(pin.binding)}} </td>
                                <td> {{multiplicityKindString(pin.tokenMultiplicity)}} </td>
                                <td> {{multiplicityKindString(pin.dataMultiplicity)}} </td>
                                <td> {{getDataTypeNameById(pin.dataTypeUid)}} </td>
                                <td> {{getDataStructureNameById(pin.dataStructureUid)}}</td>
                                <td> {{getDataAccessTypeNameById(pin.accessTypeUid)}} </td>
                                <td> <button type="button" class = "btn btn-danger btn-sm " @click="pins.splice(ind,1)"> Remove </button> </td>
                            </tr>
                            <tr v-if=" ! pins || pins.length == 0">
                                <td colspan="100" class="text-center">
                                    This module release has no pins.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <!-- <button @click= "addPin()" type="button"> Add Pin </button> -->
    </div>
</template>

<script src = "./PinTable.js">