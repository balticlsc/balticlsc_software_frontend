<template>

	<div v-if="loaded">
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
						<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
					</div>

				</div>
			</div>
		</div>

		<!-- The Modal for Environment variable  -->
		<div class="modal" id="createEnvVariable">
			<div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">

					<!-- Modal Header -->
					<div class="modal-header">
							<h4 class="modal-title">Create new variable mapping entry ... </h4>
							<button type="button" class="close" data-dismiss="modal">&times;</button>
					</div>

					<!-- Modal body -->
					<div class="modal-body">
						<form>
							<div class="form-group">
								<label for="var_name_id" >Access credential name :</label>
								<input type="text" class="form-control" id="acc_cred_name_id" 
										aria-describedby="emailHelp" placeholder="Enter credential name  ... ">
								<div class="invalid-feedback">A non empty name is required</div>
							</div>

							<div class="form-group">
								<label for="default_var_value_id" >Default credential value :</label>
								<input type="text" class="form-control" id="default_cred_value_id" 
										aria-describedby="emailHelp" placeholder="Enter default credential value  ... ">
								<div class="invalid-feedback">A non empty value is required</div>
							</div>

							<div class="form-group">
								<label for="env_var_name_id" >Environment variable name :</label>
								<input type="text" class="form-control" id="env_var_name_id" 
										aria-describedby="emailHelp" placeholder="Enter env var name  ... ">
								<div class="invalid-feedback">A non empty name is required</div>
							</div>
						</form>
					</div>

					<!-- Modal footer -->
					<div class="modal-footer">
						<button type="button" class="btn btn-primary" @click="createEnvVarMappingEntry()">Create</button>
						<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
					</div>

				</div>
			</div>
		</div>



		<!-- <p>computations module</p>
		<p>moduleId: {{ module.uid }}</p>
		{{module}} -->
		<div class="row card shadow" :id="module.uid" v-if="false">

			<div class="col-md-12  " style="background: white;">

				<div class="row">
					<div class="col-md-11" >
						<div class="media h-100 py-2" >
							<img :src="module.icon" class="mr-3 col-md-2" alt="" >
							<div class="media-body">
								<div>
									<h2 class="mt-0">
										{{ module.name }}
									</h2>
								</div>

								<div>
									<!--<span :id="app.authorId">
										By 
										<router-link :to="{ name: 'Person', params: {personId: app.authorId } }">
											{{ app.authorFullName }}
										</router-link>
									</span>
									<span> &bull; </span> -->
									<span>
										Updated on {{ module._lastUpdateDate | moment("MMMM Do YYYY, HH:mm") }}
									</span>
								</div>

								<div>
									{{ module.longDescription }}
								</div>

								<div>
									<span class="badge badge-secondary" style="margin-right: 5px;" v-for="keyword in module.keywords" v-bind:key="keyword">{{ keyword }}</span>
								</div>
							</div>
						</div>
					</div>

					<div class="col-md-1" style="background: white;margin-top: 10px;">
						<div class="row ">
							<div class="col-md-6">
								<div class="row">
									<span class=" font-weight-bold">
										{{ module.timesUsed }}
									</span>
								</div>
								<div class="row ">
									<span>Used</span>
								</div>
							</div>

							<div class="col-md-6">
								<div class="row">
									<span class=" font-weight-bold">{{ module.rate }}</span>
								</div>
								<div class="row">
									<span>Rate</span>
								</div>
							</div>
						</div>

						<div class="row justify-content-center align-items-center">
							<div class="col-md-6" style="margin-bottom: 10px;">
								<button v-if="module.isInstalled" type="button" class="btn btn-sm btn-danger" v-on:click="uninstallApp">Remove</button>
							</div>
						</div>
					</div>
				</div>
				<!-- <div class="row">
					<div class="col-md-2 offset-md-10 btn-group mb-2" role="group">
						
						<router-link type="button" :to="{ name: 'ComputationModule_Edit', params: {moduleId: this.module.uid} }" class="btn btn-sm btn-primary mr-2">
							<i class="fa fa-edit mr-2"></i>Edit 
						</router-link>
						<button type="button" class="btn btn-sm btn-danger" data-toggle="modal" data-target="#delete-module"><i class="fa fa-trash mr-2"></i>Delete</button>
					</div>
				</div> -->
			</div>
		</div>
		
		<div class="row" style="margin-top: 20px;" v-if="false">
			<div class="col-md-12">
				<div class="card shadow mb-4">
					<div class="card-header py-3">
						<h6 class="m-0 font-weight-bold text-primary">Module properties: </h6>
					</div>

					<div class="card-body">
						<div class="col-md-12">
							<form class="form-horizontal" @submit.prevent="updateModule()">
								<div class="form-group row">
									<label class="font-weight-bold col-md-2 col-form-label text-right" for="inputEmail3">Name : </label>
									<input type="text" class="form-control col-md-8" id="name_id" ref = "name_elem_ref"  v-model="module.name">
								</div>
								<div class="form-group row">
									<label class="font-weight-bold col-md-2 col-form-label text-right">Short description : </label>
									<input type="text" class="form-control col-md-8"   v-model="module.shortDescription">
								</div>
								<div class="form-group row">
									<label class="font-weight-bold col-md-2 col-form-label text-right" >Long description : </label>
									<textarea class="form-control col-md-8" rownum="2" v-model="module.longDescription">AAA</textarea>
								</div>
								<div class="form-group row">
									<label class="font-weight-bold col-md-2 col-form-label text-right">Icon path : </label>
									<input type="text" class="form-control col-md-8"  placeholder="Email" v-model="module.icon">
								</div>
								<!-- <div class="form-group row">
									<label class="font-weight-bold col-md-2 col-form-label text-right">Keywords array : </label>
									<label class="col-md-8"><a href="">www.example.com</a></label>

								</div> -->
								<div class=" form-group row">
									<label class="font-weight-bold col-md-2 col-form-label text-right" >Keywords : </label>
									<div class= "col-md-8">
										<!-- <br/> -->
										<!-- <div class="form-group row">
											
										</div> -->
										<div class="form-group row">
											<input type="text" class="col-md-10  form-control form-control-sm"  placeholder="Keyword text" v-model="currentKeyword">
											<button type="button" class="btn  btn-info btn-sm col-md-2 " @click="addKeyword()"> Add keyword </button>
										</div>
										<div class="row">
											
											<!-- <button type="button btn btn-sm" class="close" aria-label="Close">
												<span aria-hidden="true" class="badge badge-pill badge-secondary"> Keyword1 &times; </span>
											</button>

											<button type="button btn btn-sm" class="close" aria-label="Close">
												<span aria-hidden="true" class="badge badge-pill badge-dark"> Keyword1 &times; </span>
											</button>

											<button type="button btn btn-sm" class="close" aria-label="Close">
												<span aria-hidden="true" class="badge badge-pill badge-light"> Keyword1 &times; </span>
											</button> -->
											<label class="" v-show="this.module.keywords.length == 0">This module has no keywords. Add one ... </label>
											<button v-for = "(keyword,ind) in module.keywords" class="button btn btn-sm close mr-2"  aria-label="Close" :key="ind" @click="module.keywords.splice(ind,1)">
												<span aria-hidden="true" class="badge badge-pill badge-dark"> {{keyword}} &times; </span>
											</button>
											
  
											<!-- <button type="button" class="btn  btn-danger btn-sm float-left mb-2" @click="showAddPinModal()"> Remove </button>						 -->
										</div>
										<!-- <div class="row">
											<button type="button" class="btn  btn-info btn-sm float-left mb-2" @click="showAddPinModal()"> Remove</button>						
										</div> -->
									</div>

									
						
								</div>

								<div class="form-group row">
									<label class="font-weight-bold col-md-2 col-form-label text-right">pClass : </label>
									<input type="text" class="form-control col-md-8"  v-model="module.pClass">
								</div>

								<div class="form-row ">
									<div class="col-md-4 offset-md-4 btn-group">
										<button type="submit" class="btn btn-primary mr-2">Update module</button>
										<button type="button" class="btn btn-primary" @click="$router.go(-1)">Cancel</button>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="row" style="margin-top: 20px;">
			<div class="col-md-12">
				<div class="card shadow mb-4">
					<div class="card-header py-3">
						<h6 class="m-0 font-weight-bold text-primary">App release properties: </h6>
					</div>

					<div class="card-body">
						<div class="col-md-12">
							<form class="form-horizontal" @submit.prevent="updateModule()">
																
								<div class="form-group row">
									<label for="module_release_version_name_id" class="font-weight-bold col-md-2 col-form-label text-right">Version :</label>
									<input type="text" class="form-control col-md-8" id="module_release_version_name_id"
											v-model = "moduleRelease.version" 
											aria-describedby="emailHelp" placeholder="Enter version ... ">
									<div class="invalid-feedback">A non empty version description is required</div>
									
								</div>

								<div class="form-group row">
									<label for="description_txt_area" class="font-weight-bold col-md-2 col-form-label text-right">Description : </label>

									<!-- :class  = "{'is-invalid': validateModuleRelease && moduleYAMLContent != null && moduleYAMLContent.trim().length < 1 }"
											@blur   = "validateModuleRelease = true" -->

									<textarea class="form-control col-md-8" id="description_txt_area" rows="2"
											v-model = "moduleRelease.description" 
											placeholder="Enter description  ... "></textarea>
									
									<div class="invalid-feedback">A non empty description is required</div>
									
								</div>
								<div class="form-group row">
									<!-- <div class="form-check"> -->
										<label class="font-weight-bold col-md-2 col-form-label text-right" >
											OpenSource:
										</label>
										<div class="col-md-8 card p-2 ">
											<!-- <input class="form-control form-check-input col-md-8 " type="checkbox" id="gridCheck"> -->
											<div class="form-check form-check-inline">
												<input class="form-check-input" type="checkbox" id="inlineCheckbox1" v-model="moduleRelease.openSource" />
												<label class="form-check-label" for="inlineCheckbox1">isOpenSource</label>
											</div>
										</div>
									<!-- </div> -->
								</div>

								<div class="form-group row" v-if="false">
									<label class="font-weight-bold col-md-2 col-form-label text-right" for="inputEmail3">Image : </label>
									<input type="text" class="form-control col-md-8" id="name_id" ref = "name_elem_ref"  v-model="moduleRelease.image">
								</div>
								<div class="form-group row" v-if="false">
									<label class="font-weight-bold col-md-2 col-form-label text-right">Command : </label>
									<input type="text" class="form-control col-md-8"   v-model="moduleRelease.command">
								</div>
								<div class="form-group row" v-if="false">
									<label class="font-weight-bold col-md-2 col-form-label text-right" >Command arguments : </label>

									<div class="col-md-8 card p-2 ">
										<div class = "form-row justify-content-end input-group-sm pr-2">
											<input type="text" class="form-control col-md-3" placeholder = "Enter argument ... "
											v-model="currComandArgument">
											<button class= "btn btn-info btn-sm ml-1"
													type="button"
													@click="addCommandArgument()">Add command argument</button>
										</div>
										<div class = "row">
											<ul v-if="moduleRelease.commandArguments.length > 0">
												<li v-for ="comArg,ind in moduleRelease.commandArguments">
													{{comArg}}
													<button 
														class= "btn btn-danger btn-sm  ml-auto mb-1"
														type="button"
														@click="moduleRelease.commandArguments.splice(ind,1)">
															Remove
													</button>
												</li>
											</ul>
											<div v-else class = "pl-3">List of command arguments is empty</div>
										</div>
									</div>
								</div>

								<div class="form-group row" v-if="false">
									<label class="font-weight-bold col-md-2 col-form-label text-right" >Required services : </label>

									<div class="col-md-8 card p-2 ">
										<div class = "form-row justify-content-end input-group-sm pr-2">
											<input type="text" class="form-control col-md-3" placeholder = "Enter service ... "
											v-model="currService">
											<button class= "btn btn-info btn-sm ml-1"
													type="button"
													@click="addRequiredService()">Add service</button>
										</div>
										<div class = "row">
											<ul v-if="moduleRelease.requiredServices.length > 0">
												<li v-for ="service,ind in moduleRelease.requiredServices">
													{{service}}
													<button 
														class= "btn btn-danger btn-sm  ml-auto mb-1"
														type="button"
														@click="moduleRelease.requiredServices.splice(ind,1)">
															Remove
													</button>
												</li>
											</ul>
											<div v-else class = "pl-3">List of required services is empty</div>
										</div>
									</div>
								</div>

								<div class="form-group row" v-if="false"> 
									<label class="font-weight-bold col-md-2 col-form-label text-right" >Variable mappings : </label>

									<div class="col-md-8 card p-2 ">
										<div class = "form-row justify-content-end pr-2">
											<button type="button" class="btn btn-info btn-sm pr-2" data-toggle="modal" data-target="#createEnvVariable"> Add mapping </button>
										</div>
										<label class="form-check-label" for="varMappingsTable">Variable mappings:</label>

										<div class="table-responsive">
											<table class="table table-condensed table-striped table-bordered" id="varMappingsTable">
												<!-- <caption>Pins</caption> -->
												<thead>
													<tr>
														
														<th>Access Credential Name</th>
														<th>Default Credential Value</th>
														<th>Environment Variable Name</th>
														
														<th>Action</th>
													</tr>
												</thead>
												<tbody>
													<tr v-for="(mappingEntry,ind) in moduleRelease.variableMappings" >
														
														<!-- <td> {{mappingEntry.accessVariableName}} </td>
														<td> {{mappingEntry.defaultVariableValue}} </td> -->
														<td> {{mappingEntry.accessCredentialName}} </td>
														<td> {{mappingEntry.defaultCredentialValue}} </td>
														<td> {{mappingEntry.environmentVariableName}} </td>
														
														<td> <button class = "btn btn-danger btn-sm " @click="moduleRelease.variableMappings.splice(ind,1)"> Remove </button> </td>
													</tr>
													<tr v-if=" ! moduleRelease.variableMappings || moduleRelease.variableMappings.length == 0">
														<td colspan="100" class="text-center">
															This module release has no variable mappings.
														</td>
													</tr>
												</tbody>
											</table>
										</div>
									</div>
								</div>

								<div class="form-group row" >
									<label class="font-weight-bold col-md-2 col-form-label text-right" >Pins : </label>

									<div class="col-md-8 card p-2 ">
										<div class = "form-row justify-content-end pr-2">
											<button type="button" class="btn btn-info btn-sm pr-2" data-toggle="modal" data-target="#createDeclaredPin" disabled> Add pin </button>
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
													<tr v-for="(pin,ind) in moduleRelease.pins" >
														<td> {{pin.name}} </td>
														<td> {{bindingKindString(pin.binding)}} </td>
														<td> {{multiplicityKindString(pin.tokenMultiplicity)}} </td>
														<td> {{multiplicityKindString(pin.dataMultiplicity)}} </td>
														<td> {{getDataTypeNameById(pin.dataTypeUid)}} </td>
														<td> {{getDataStructureNameById(pin.dataStructureUid)}}</td>
														<td> {{getDataAccessTypeNameById(pin.accessTypeUid)}} </td>
														<td> <button class = "btn btn-danger btn-sm " @click="moduleRelease.pins.splice(ind,1)" disabled> Remove </button> </td>
													</tr>
													<tr v-if=" ! moduleRelease.pins || moduleRelease.pins.length == 0">
														<td colspan="100" class="text-center">
															This module release has no pins.
														</td>
													</tr>
												</tbody>
											</table>
											<p class="pt-2 mt-2 text-muted"> * Pin editing is not available here. App release pins configuration can be changed inside CAL editor.</p>
										</div>
									</div>
								</div>

								<!-- <div class="row">
									<div class="col-md-8 d-flex justify-content-end justify-content-md-center px-2 px-md-3 order-1 order-md-0">
										<div>
											<div class="input-group input-group-sm">
												<div class="input-group-prepend"><button class="btn btn-sm btn-outline-secondary border-300 px-2" data-field="input-quantity" data-type="minus" type="button">-</button></div><input class="form-control text-center px-2 input-quantity input-spin-none" type="number" min="1" value="1" aria-label="Amount (to the nearest dollar)" style="max-width: 40px">
												<div class="input-group-append"><button class="btn btn-sm btn-outline-secondary border-300 px-2" data-field="input-quantity" data-type="plus" type="button">+</button></div>
											</div>
										</div>
									</div>
								</div> -->

								<div class="row">
									
									<!-- <div>
										<div class="input-group input-group-sm">
											<div class="input-group-prepend"><button class="btn btn-sm btn-outline-secondary border-300 px-2" data-field="input-quantity" data-type="minus" type="button">-</button></div><input class="form-control text-center px-2 input-quantity input-spin-none" type="number" min="1" value="1" aria-label="Amount (to the nearest dollar)" style="max-width: 40px">
											<div class="input-group-append"><button class="btn btn-sm btn-outline-secondary border-300 px-2" data-field="input-quantity" data-type="plus" type="button">+</button></div>
										</div>
									</div> -->
									<!-- <br/>
									{{cpu.range[0]}}
									<b-form-slider id="new-cpu" ref="new-cpu" v-model="cpu.range" range :min="cpu.min" :max="cpu.max"></b-form-slider>
									{{cpu.range[1]}} -->
									
								</div>

								<div class="form-group row">
									<label class="font-weight-bold col-md-2 col-form-label text-right" >Resource ranges : </label>

									<div class="col-md-8 card p-2 ">
										<div class = "row">
											<div class="col-2 text-right">
												CPU : 
											</div>
											<div class="col-10">
												<div class="row">
													<br/>
												</div>
												<div class="row">
													<div class="pr-2  col-2 pl-0">
														<span class="badge badge-secondary badge-pill w-100" data-range-value-low="200" id="input-slider-range-value-low">From: {{cpu.range[0]}} CPU</span>
													</div>
													<b-form-slider id="cpu" v-model="cpu.range"  :min="cpu.min" :max="cpu.max"  tooltip="show" ></b-form-slider>
													
													<div class="col-2 pl-2 text-right">
														<span class="badge badge-secondary badge-pill w-100" data-range-value-high="400" id="input-slider-range-value-high">To: {{cpu.range[1]}} CPU</span>
													</div>
												</div>
											</div>
										</div>

										<div class = "row">
											<div class="col-2 text-right">
												GPU : 
											</div>
											<div class="col-10">
												<div class="row">
													<br/>
												</div>
												<div class="row">
													
													<div class="pr-2  col-2 pl-0">
														<span class="badge badge-secondary badge-pill w-100" data-range-value-low="200" id="input-slider-range-value-low">From: {{gpu.range[0]}} GPU</span>
													</div>
													<b-form-slider id="gpu" v-model="gpu.range"  :min="gpu.min" :max="gpu.max"  tooltip="show" ></b-form-slider>
													
													<div class="col-2 pl-2 text-right">
														<span class="badge badge-secondary badge-pill w-100" data-range-value-high="400" id="input-slider-range-value-high">To: {{gpu.range[1]}} GPU</span>
													</div>
												</div>
											</div>
										</div>

										<div class = "row">
											<div class="col-2 text-right "> <!-- pr-0 -->
												Memory: 
											</div>
											<div class="col-10">
												<div class="row">
													<br/>
												</div>
												<div class="row">
													<div class="pr-2  col-2 pl-0">
														<span class="badge badge-secondary badge-pill w-100" data-range-value-low="200" id="input-slider-range-value-low">From: {{memory.range[0]}} GB</span>
													</div>
													<b-form-slider id="memory" v-model="memory.range"  :min="memory.min" :max="memory.max"  tooltip="show" ></b-form-slider>
													
													<div class="pl-2 col-2 text-right">
														<span class="badge badge-secondary badge-pill w-100" data-range-value-high="400" id="input-slider-range-value-high">To: {{memory.range[1]}} GB</span>
													</div>
												</div>
											</div>
										</div>

										<div class = "row">
											<div class="col-2 text-right "> <!-- pr-0 -->
												Storage: 
											</div>
											<div class="col-10">
												<div class="row">
													<br/>
												</div>
												<div class="row">
													<div class="pr-2  col-2 pl-0">
														<span class="badge badge-secondary badge-pill w-100" data-range-value-low="200" id="input-slider-range-value-low">From: {{storage.range[0]}} GB</span>
													</div>
													<b-form-slider id="storage" v-model="storage.range"  :min="storage.min" :max="storage.max"  tooltip="show" ></b-form-slider>
													
													<div class="pl-2 col-2 text-right">
														<span class="badge badge-secondary badge-pill w-100" data-range-value-high="400" id="input-slider-range-value-high">To: {{storage.range[1]}} GB</span>
													</div>
												</div>
											</div>
										</div>

									</div>
								</div>


								<!-- <div class="form-group row">
									<label class="font-weight-bold col-md-2 col-form-label text-right">Required services : </label>
									<input type="text" class="form-control col-md-8"  placeholder="Email" v-model="module.icon">
								</div> -->
								<!-- <div class="form-group row">
									<label class="font-weight-bold col-md-2 col-form-label text-right">Keywords array : </label>
									<label class="col-md-8"><a href="">www.example.com</a></label>

								</div> -->
								
								<!-- <div class="form-group row">
									<label class="font-weight-bold col-md-2 col-form-label text-right" >Resource ranges : </label>

									<div class="col-md-8 card p-2 ">

										<div class="row">
											<div class="col-2 text-right">
												CPU : 
											</div>

											<div class="col-auto">
												
												<div class="form-row align-items-center">
													<div class="col-auto">
														<div class="input-group mb-2">
															<div class="input-group-prepend">
																<div class="input-group-text">Min</div>
															</div>
															<input type="number"   min="0" max="100" class="form-control" v-model="moduleRelease.supportedResourcesRange.minCPU">
														</div>
													</div>
													<div class="col-auto">
														
														<div class="input-group mb-2">
															<div class="input-group-prepend">
																<div class="input-group-text">Max</div>
															</div>
															<input type="number"  min="0" max="100" class="form-control" v-model="moduleRelease.supportedResourcesRange.maxCPU">
														</div>
													</div>
												</div>
												
											</div>
										</div>
										
										
									</div>
								</div> -->

								
								<div class="form-row ">
									<div class="col-md-4 offset-md-4 btn-group">
										<button type="submit" class="btn btn-primary mr-2">Update app release</button>
										<button type="button" class="btn btn-primary" @click="$router.go(-1)">Cancel</button>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
		
	</div>
	
</template>

<script src="./ComputationApplicationRelease_Edit.js"></script>