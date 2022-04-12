<template>
	<div v-if="loaded">
		<!-- <p>computations module</p>
		<p>moduleId: {{ module.uid }}</p>
		{{module}} -->

		<div class="modal" id="delete-module">
			<div class="modal-dialog">
				<div class="modal-content">

					<div class="modal-header">
						<h5 class="modal-title">Delete module. Are you sure?</h5>
						<button type="button" class="close" data-dismiss="modal">&times;</button>
					</div>

					<div class="modal-body">
						<div class="alert alert-danger" role="alert">
							You are about to delete this module. Are you sure ?
						</div>
					</div>

					<div class="modal-footer">
						<button type="button" class="btn btn-danger" data-dismiss="modal" @click="deleteModule">Delete</button>
						<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
					</div>

				</div>
			</div>
		</div>

		<div class="modal" id="delete-module-release">
			<div class="modal-dialog">
				<div class="modal-content">

					<div class="modal-header">
						<h5 class="modal-title">Delete module release {{currRelease != null ? currRelease.version:""}}. Are you sure?</h5>
						<button type="button" class="close" data-dismiss="modal">&times;</button>
					</div>

					<div class="modal-body">
						<div class="alert alert-danger" role="alert">
							You are about to delete this module release - id = {{currRelease != null ? currRelease.uid :""}}.<br/> Are you sure ?
						</div>
					</div>

					<div class="modal-footer">
						<button type="button" class="btn btn-danger" data-dismiss="modal" @click="deleteModuleRelease">Delete</button>
						<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
					</div>

				</div>
			</div>
		</div>

		

		<div class="modal" id="create-module-release">
			<div class="modal-dialog modal-xl">
				<div class="modal-content">

					<div class="modal-header">
						<h5 class="modal-title">Create module release ... </h5>
						<button type="button" class="close" data-dismiss="modal">&times;</button>
					</div>
					<form @submit.prevent="createModuleRelease();">
						<div class="modal-body">
							
								<div class="form-group row mr-2">
									<label for="name_id" class = "col-md-2 col-form-label text-right">Version name :</label>
									<input type="text" class="form-control col-md-10" id="name_id" v-model="versionName"
											placeholder="Enter version name  ... ">
									<div class="invalid-feedback">A non empty name is required</div>
								</div>

								<div class="form-group row mr-2">
									<!-- class="col-md-2 col-form-label text-right" -->
									<label for="description_id" class="col-md-2 col-form-label text-right" >Description :</label>
									<input type="text" class="form-control col-md-10" id="description_id" v-model="description"
											placeholder="Enter description  ... ">
									<!-- <div class="invalid-feedback">A non empty name is required</div> -->
								</div>

								<div class="form-group row mr-2">
									<!-- class="col-md-2 col-form-label text-right" -->
									<label for="imageName_id" class="col-md-2 col-form-label text-right" >Image :</label>
									<input type="text" class="form-control col-md-10" id="imageName_id" v-model="imageName"
											placeholder="Enter image name  ... ">
									<!-- <div class="invalid-feedback">A non empty name is required</div> -->
								</div>

								<!-- <div class="form-group row mr-2"> -->
									<!-- class="col-md-2 col-form-label text-right" -->
									<!-- <label for="command_id" class="col-md-2 col-form-label text-right" >Command :</label>
									<input type="text" class="form-control col-md-10" id="command_id" v-model="command"
											placeholder="Enter command  ... "> -->
									<!-- <div class="invalid-feedback">A non empty command is required</div> -->
								<!-- </div> -->

								<PinTable ref = "pinsTable_1"></PinTable>

							
						</div>

						<div class="modal-footer">
							<button type="submit" class="btn btn-primary"  name="submit" value="Submit" >Create</button>
							<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
						</div>
					</form>
				</div>
			</div>
		</div>

		<div class="row card shadow" :id="module.uid">

			<div class="col-md-12  " style="background: white;">

				<div class="row">
					<div class="col-md-11" >
						<div class="media h-100 py-2" >
							<img :src="module.icon" class="mr-3" alt="" style= "height: 100px; width: 100px;">
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
				<!-- <div class="row" v-show="isUnitOwnedByCurrentUser(module)">
					<div class="col-md-2 offset-md-10 btn-group mb-2" role="group">
						
						<router-link type="button" :to="{ name: 'ComputationModule_Edit', params: {moduleId: this.module.uid} }" class="btn btn-sm btn-primary mr-2">
							<i class="fa fa-edit mr-2"></i>Edit 
						</router-link>
						<button type="button" class="btn btn-sm btn-danger" data-toggle="modal" data-target="#delete-module"><i class="fa fa-trash mr-2"></i>Delete</button>
					</div>
				</div> -->
				<div class="row justify-content-between">
					<div class="col-auto  btn-group mb-2" role="group" >
						<button type="button" class="btn btn-sm btn-success mr-2" 
							v-if ="!isUnitDeprecated(module) && canAddModuleToToolBox(module)"
							@click="addUnitToToolbox(module)">
							<i class="fa fa-toolbox mr-2"></i> Add to toolbox
						</button>
						
						<button type="button" class="btn btn-sm btn-danger mr-2" 
							v-if="canRemoveUnitFromToolbox(module)"
							@click="removeAllUnitReleasesFromToolbox(module)">
							<i class="fa fa-toolbox mr-2"></i> Remove from toolbox
						</button>
						
					</div>
					<div class="col-auto  btn-group mb-2" role="group" v-show="isUnitOwnedByCurrentUser(module)">
						<!-- <button type="button" class="btn btn-sm btn-primary mr-2" v-on:click="deleteModule()" title><i class="fa fa-edit mr-2"></i> Edit </button> -->
						
						<!-- <button type="button" class="btn btn-sm btn-primary mr-2" ><i class="fa fa-code-branch mr-2"></i> Create release  </button> -->
						<!-- <button type="button" class="btn btn-sm btn-primary mr-2" ><i class="fa fa-project-diagram mr-2"></i> Edit diagram </button> -->
						
						<router-link type="button" :to="{ name: 'ComputationModule_Edit', params: {id: this.module.uid} }" class="btn btn-sm btn-primary mr-2">
							<i class="fa fa-edit mr-2"></i>Edit module
						</router-link>
						<button type="button" class="btn btn-sm btn-danger" data-toggle="modal" data-target="#delete-module"><i class="fa fa-trash mr-2"></i>Delete</button>
					</div>
				</div>
			</div>
		</div>
		

		<div class="row" style="margin-top: 20px;">
			<div class="col-md-12">
				<div class="card shadow mb-4">
					
					<div class="card-header py-3">
						<div class = "row justify-content-between pr-1 pl-1 ">
							<h5 class="m-0 font-weight-bold text-primary">Releases</h5> 
							<button type="button" class="btn btn-sm btn-primary" data-toggle="modal" data-target="#create-module-release"  v-show="isUnitOwnedByCurrentUser(module)">
								<i class="fa fa-code-branch mr-2"></i>Create release
							</button>
						</div>
					</div>

					<div class="card-body">
						<div class="row justify-content-center mb-2">
							<div class="col-12">
								<div class="row justify-content-end mb-2">
									<div class="dropdown indexDropdown">
										<label class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
											<!-- <img src=https://cdn.jsdelivr.net/npm/bootstrap-icons/icons/arrow-down-up.svg width="16" height="16" alt=""> -->
											<i class="fa fa-arrows-alt-v"></i>
											Sort by
											<span class="caret"></span>
											</label>
											<ul class="dropdown-menu  dropdown-menu-right" x-placement="top-end" aria-labelledby="dropdownMenu1">
												<!-- <li class = "dropdown-item disabled">UID</li> -->
												<li class = "dropdown-item " @click="sortOrderChanged('Version')"> 
													<i class="fas fa-check mr-1" v-show = "releaseSortOrder == 'Version'" ></i> 
													<i class="mr-3" v-show = "releaseSortOrder != 'Version'">  </i>
													Version name
												</li>
												<li class = "dropdown-item " @click="sortOrderChanged('Date')"> 
													<i class="fas fa-check mr-1" v-show = "releaseSortOrder == 'Date'" ></i> 
													<i class="mr-3" v-show = "releaseSortOrder != 'Date'">  </i>
													Date
												</li>
											</ul>
										</div>
								</div>
								<div class="card mb-2" v-for="release in orderedReleases" :key="release.uid">
									<div class="card-header ">

										<div class = "row justify-content-between pr-1 pl-1 ">
											<div class="col">
												<div class="row">
													<a data-toggle="collapse" :href="'#id_'+ release.uid +'_collapse-example'" aria-expanded="true" :aria-controls="'id_'+release.uid +'_collapse-example'" id="heading-example" >
														
														<h6 class="m-0 font-weight-bold text-primary"><i class="fa fa-chevron-down "></i> {{release.version}} (UID: {{release.uid}})</h6> 
													<!-- <button type="button" class="btn btn-sm btn-primary" data-toggle="modal" data-target="#delete-module"><i class="fa fa-code-branch mr-2"></i>Create release</button> -->

													
													</a>
												</div>
												
											</div>

											<!-- context menu   -->

											<div class="col-auto">

												<!-- Dropdown -->
												<div class="dropdown  no-arrow">
												<a href="#" class="dropdown-ellipses dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
													<i class="fas fa-ellipsis-v fa-sm fa-fw "></i>
												</a>
												<div class="dropdown-menu dropdown-menu-right " x-placement="top-end" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(-171px, -119px, 0px);">
													
													
													<!-- <a href="#!" class="dropdown-item h6 disabled">
														<i class="fa fa-toolbox dropdown-item-icon ">&nbsp;&nbsp;</i>
														Add to toolbox 1
													</a> -->
												
													<a class = "mb-2 dropdown-item h6 text-danger" 
														@click = "removeModuleReleaseFromToolbox(release.uid)" 
														v-if="moduleReleaseIsInToolbox(release.uid)"
														:disabled = "isLoading">
														<i class="fa fa-toolbox dropdown-item-icon ">&nbsp;&nbsp;</i>
															Remove from toolbox
													</a>
													
													<a class = "mb-2 dropdown-item h6 text-success" 
														@click = "addModuleReleaseToToolbox(release.uid)"
														v-if="!module.isService && release.status != 3 && !moduleReleaseIsInToolbox(release.uid)" 
														:disabled = "isLoading">
														<i class="fa fa-toolbox dropdown-item-icon ">&nbsp;&nbsp;</i>
															Add to toolbox
													</a>

													<!-- <a href="#!" class="dropdown-item h6 disabled" v-show="isUnitOwnedByCurrentUser(module)">
														<i class="fa fa-edit dropdown-item-icon">&nbsp;&nbsp;</i>
														Edit
													</a> -->

													<router-link 
														tag="button"
														:disabled="false"
														v-show="isUnitOwnedByCurrentUser(module)"
														:to="{ name: 'ComputationModuleRelease_Edit', params: {moduleReleaseId: release.uid} }" 
														class=" dropdown-item h6 mb-2 " 
														>
															<i class="fa fa-edit mr-2 "></i>Edit
													</router-link>
													
													<a  class="dropdown-item text-danger h6" 
														v-show="isUnitOwnedByCurrentUser(module)"
														@click="currRelease = release" type="button"  data-toggle="modal" data-target="#delete-module-release">
															<i class="fa fa-trash dropdown-item-icon">&nbsp;&nbsp;</i>
															Delete
													</a>

												</div>
												</div>

											</div>
											
										</div>

										<div class="row justify-content-between pt-2">
													<!-- <div class="row "> -->
														<div class="col ">

															<!-- Title -->
															<!-- <p class="m-0 ">
																Version:  0.1.0
															</p> -->
															<p class="m-0 ">
																{{release.description}}
															</p>
														</div>

														<div class="col-auto">
															<!-- Text -->
															<p class="small text-muted mb-1">
																Release date: {{new Date(release.date).toGMTString() }}
															</p>

														</div>
													<!-- </div> -->
												</div>	
										
									</div>
									<div :id="'id_'+release.uid +'_collapse-example'" class="collapse " aria-labelledby="heading-example">
										<div class="card-body">
											<!-- <div class="row justify-content-center">
												<nav class="nav nav-pills justify-content-center nav-fill">
													<a href="#" class="nav-item nav-link">Home</a>
													<a href="#" class="nav-item nav-link">About</a>
													<a href="#" class="nav-item nav-link active">Explore Products</a>
													<a href="#" class="nav-item nav-link">Contact Us</a>
												</nav>
											</div> -->
											<div class = "row ">
												<ul class="nav nav-pills nav-fill pl-2"  id="myTab" role="tablist">
													<li class="nav-item">
														<a class="nav-link active" id="home-tab" data-toggle="tab" :href="'#id_'+release.uid + '_properties'" role="tab" :aria-controls="'id_'+release.uid + '_properties'" aria-selected="true">Properties</a>
													</li>
													<li class="nav-item">
														<a class="nav-link" id="profile-tab" data-toggle="tab" :href="'#id_'+release.uid +'_pins'" role="tab" :aria-controls="'id_'+release.uid + '_pins'" aria-selected="false">Pins</a>
													</li>
													<li class="nav-item">
														<a class="nav-link" id="contact-tab" data-toggle="tab" :href="'#id_'+release.uid +'_resource_ranges'" role="tab" :aria-controls="'id_'+release.uid + '_resource_ranges'" aria-selected="false">Resource ranges</a>
													</li>
												</ul>
											</div>
											<div class="row pl-2">
												<div class="tab-content container-fluid" id="myTabContent">
													<div class="tab-pane fade show active" :id="'id_'+release.uid + '_properties'" role="tabpanel" aria-labelledby="home-tab">
														
														<div class="row pt-2">
															<div class="col-2 text-right">
																Image : 
															</div>
															<div class="col-auto">
																{{release.image}}
															</div>
															
														</div>
														<div class="row">
															<div class="col-2 text-right">
																Command : 
															</div>

															<div class="col-auto">
																{{release.command}}
															</div>
															
														</div>
														<div class="row">
															<div class="col-2 text-right">
																Command arguments : 
															</div>
															<div class="col-auto">
																<ul v-if="release.commandArguments.length > 0">
																	<li v-for ="comArg in release.commandArguments">{{comArg}}</li>
																</ul> 
																<div v-else>List of command arguments is empty</div>
															</div>
															
														</div>
														<div class="row">
															<div class="col-2 text-right">
																Required services : 
															</div>
															<div class="col-auto">
																<ul v-if="release.requiredServices.length > 0">
																	<li v-for ="service in release.requiredServices">{{service}}</li>
																</ul> 
																<div v-else>List of required services is empty</div>
															</div>
														</div>

														<div class="row">
															<div class="col-2 text-right">
																Variable mappings : 
															</div>
															<div class="col-auto">
																<table class="table table-bordered table-striped dataTable" id="release-table" width="100%" cellspacing="0" role="grid" aria-describedby="dataTable_info" style="width: 100%;padding:10px;">
																	<thead>
																		<tr role="row">
																			<th>Access Credential Name</th>
																			<th>Default Credential Value</th>
																			<th>Environment Variable Name</th>
																		</tr>
																	</thead>

																	<tbody>
																		<tr role="row" class="release" v-for="varMapping in release.variableMappings" >
																			<td>{{ varMapping.accessCredentialName }}</td>
																			<td>{{ varMapping.defaultCredentialValue }}</td>
																			<td>{{ varMapping.environmentVariableName }}</td>
																		</tr>
																		<!-- <tr role="row" class="release" >
																			
																			<td>{{ "var name 2" }}</td>
																			<td>{{ " value 2"}}</td>
																			<td>{{ " env var 2" }}</td>
																		</tr> -->
																		<tr role="row" class="release" v-if="release.variableMappings.length == 0"  >
																			<td colspan = "3" class="text-center">List of variable mappings is empty.</td>
																		</tr>
																	</tbody>
																</table>
															</div>
														</div>

														<div class="row">
															<div class="col-2 text-right">
																Open source : 
															</div>
															<div class="col">
																{{release.openSource}}
															</div>
														</div>

														<div class="row">
															<div class="col-2 text-right">
																Status : 
															</div>
															<div class="col">
																{{ComputationUnitStatus(release.status)}}
															</div>
														</div>
													
													</div>
													<div class="tab-pane fade mt-2" :id="'id_'+release.uid + '_pins'" role="tabpanel" aria-labelledby="profile-tab">
														
														<table class="table table-bordered table-striped dataTable" id="release-table" width="80%" cellspacing="0" role="grid" aria-describedby="dataTable_info" style="width: 100%;padding:10px;">
															
																<thead>
																	
																	<tr role="row">
																		<!-- <th>UID</th> -->
																		<th>Name</th>
																		<th>Binding</th>
																		<th>Token Multiplicity</th>
																		<th>Data Multiplicity</th>
																		<th>DataType</th>
																		<th>DataStructure</th>
																		<th>AccessType</th>
																		
																		
																		
																	</tr>
																</thead>

																<tbody>
																	<tr role="row" class="release" v-for="pin in release.pins" v-bind:key="pin.uid" :id="pin.uid">
																		<!-- <td>{{ pin.uid }}</td> -->
																		<td>{{ pin.name }}</td>
																		<td>{{ bindingKindString(pin.binding) }}</td>
																		
																		<td> {{multiplicityKindString(pin.tokenMultiplicity)}} </td>
																		<td> {{multiplicityKindString(pin.dataMultiplicity)}} </td>
																		<td> {{pin.dataTypeName}} </td>
																		<td> {{pin.dataStructureName}}</td>
																		<td> {{pin.accessTypeName}} </td>
																		
																	</tr>
																	<tr role="row" v-if="release.pins.length == 0" class="text-center">
																		<td colspan="10">This module has no pins.</td>
																	</tr>
																</tbody>
															</table>
													</div>
													<div class="tab-pane fade" :id="'id_'+release.uid + '_resource_ranges'" role="tabpanel" aria-labelledby="contact-tab">
														<!-- Resource range tab aaa<br/> -->
														<br/>
														<div class="row">
															<div class="col-2 text-right">
																CPU : 
															</div>

															<div class="col-10">
																<div class="row">
																	<br/>
																</div>
																<div class="row">
																	<div class="pr-2 col-2 pl-0">
																		<span class="badge badge-secondary badge-pill w-100" data-range-value-low="200" id="input-slider-range-value-low">From: {{release._supportedResourcesRange.CPU[0]}} CPU</span>
																	</div>
																	<b-form-slider id="new-memory" ref="new-memory"	 v-model="release._supportedResourcesRange.CPU"  :min="minMaxRanges.CPU[0]" :max="minMaxRanges.CPU[1]"  tooltip="always" disabled></b-form-slider>
																	
																	<div class="col-2 pl-2 text-right">
																		<span class="badge badge-secondary badge-pill w-100" data-range-value-high="400" id="input-slider-range-value-high">To: {{release._supportedResourcesRange.CPU[1]}} CPU</span>
																	</div>
																</div>
																<!-- <div class="row ">
																	<div class="col-6">
																		<span class="badge badge-secondary badge-pill" data-range-value-low="200" id="input-slider-range-value-low">{{app.memory.range[0]}} Gb ??</span>
																	</div>
																	<div class="col-6 text-right">
																		<span class="badge badge-secondary badge-pill" data-range-value-high="400" id="input-slider-range-value-high">{{app.memory.range[1]}} Gb ??</span>
																	</div>
																</div> -->
															</div>
														</div>

														<div class="row mt-2">
															<div class="col-2 text-right">
																GPU : 
															</div>
														<!-- {{app.memory.range + "aaa"}} -->
														<!-- <b-form-slider id="new-memory" ref="new-memory" range :min="10" :max="20"></b-form-slider> -->
															<div class="col-10">
																<div class="row">
																	<br/>
																</div>
																<div class="row">
																	<div class="pr-2 col-2 pl-0">
																		<span class="badge badge-secondary badge-pill w-100" data-range-value-low="200" id="input-slider-range-value-low">From: {{release._supportedResourcesRange.GPU[0]}} GPU </span>
																	</div>
																	<b-form-slider id="new-memory1" ref="new-memory1" v-model="release._supportedResourcesRange.GPU"  :min="minMaxRanges.GPU[0]" :max="minMaxRanges.GPU[1]"  tooltip="always" disabled></b-form-slider>
																	<div class="col-2 pl-2 text-right">
																		<span class="badge badge-secondary badge-pill w-100" data-range-value-high="400" id="input-slider-range-value-high">To: {{release._supportedResourcesRange.GPU[1]}} GPU </span>
																	</div>
																</div>
																<!-- <div class="row ">
																	<div class="col-6">
																		<span class="badge badge-secondary badge-pill" data-range-value-low="200" id="input-slider-range-value-low">{{app.GPU.range[0]}} GPU </span>
																	</div>
																	<div class="col-6 text-right">
																		<span class="badge badge-secondary badge-pill" data-range-value-high="400" id="input-slider-range-value-high">{{app.GPU.range[1]}} GPU </span>
																	</div>
																</div> -->
															</div>
														</div>
														
														<div class="row mt-2">
															<div class="col-2 text-right">
																Memory : 
															</div>
														<!-- {{app.memory.range + "aaa"}} -->
														<!-- <b-form-slider id="new-memory" ref="new-memory" range :min="10" :max="20"></b-form-slider> -->
															<div class="col-10">
																<div class="row">
																	<br/>
																</div>
																<div class="row">
																	<div class="pr-2 col-2 pl-0">
																		<span class="badge badge-secondary badge-pill w-100" data-range-value-low="200" id="input-slider-range-value-low">From: {{release._supportedResourcesRange.memory[0]}} GB</span>
																	</div>
																	<b-form-slider id="memory"  v-model="release._supportedResourcesRange.memory"  :min="minMaxRanges.memory[0]" :max="minMaxRanges.memory[1]"  tooltip="always" disabled></b-form-slider>
																	<div class="pl-2 col-2 text-right">
																		<span class="badge badge-secondary badge-pill w-100" data-range-value-high="400" id="input-slider-range-value-high">To: {{release._supportedResourcesRange.memory[1]}} GB</span>
																	</div>
																</div>
																<!-- <div class="row ">
																	<div class="col-6">
																		<span class="badge badge-secondary badge-pill" data-range-value-low="200" id="input-slider-range-value-low">{{app.memory.range[0]}} Gb ??</span>
																	</div>
																	<div class="col-6 text-right">
																		<span class="badge badge-secondary badge-pill" data-range-value-high="400" id="input-slider-range-value-high">{{app.memory.range[1]}} Gb ??</span>
																	</div>
																</div> -->
															</div>
														</div>

														<div class="row mt-2">
															<div class="col-2 text-right">
																Storage : 
															</div>
														<!-- {{app.memory.range + "aaa"}} -->
														<!-- <b-form-slider id="new-memory" ref="new-memory" range :min="10" :max="20"></b-form-slider> -->
															<div class="col-10">
																<div class="row">
																	<br/>
																</div>
																<div class="row">
																	<div class="pr-2 col-2 pl-0">
																		<span class="badge badge-secondary badge-pill w-100" data-range-value-low="200" id="input-slider-range-value-low">From: {{release._supportedResourcesRange.storage[0]}} GB </span>
																	</div>
																	<b-form-slider id="storage" v-model="release._supportedResourcesRange.storage"  :min="minMaxRanges.storage[0]" :max="minMaxRanges.storage[1]"  tooltip="always" disabled></b-form-slider>
																	<div class="pl-2 col-2 text-right">
																		<span class="badge badge-secondary badge-pill w-100" data-range-value-high="400" id="input-slider-range-value-high">To: {{release._supportedResourcesRange.storage[1]}} GB</span>
																	</div>
																</div>
																<!-- <div class="row ">
																	<div class="col-6">
																		<span class="badge badge-secondary badge-pill" data-range-value-low="200" id="input-slider-range-value-low">{{app.memory.range[0]}} Gb ??</span>
																	</div>
																	<div class="col-6 text-right">
																		<span class="badge badge-secondary badge-pill" data-range-value-high="400" id="input-slider-range-value-high">{{app.memory.range[1]}} Gb ??</span>
																	</div>
																</div> -->
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>

							</div>
						</div>
						
						
						<div class="col-md-12" v-show="false">
							<div class="table-responsive">
								<table class="table table-bordered table-striped dataTable" id="release-table" width="100%" cellspacing="0" role="grid" aria-describedby="dataTable_info" style="width: 100%;padding:10px;">
									
									<thead>
										<tr role="row">
											<th>Actions</th>
											<th>UID</th>
											<th>Version</th>
											<!-- <th>Author</th> -->
											<th>Release date</th>
											<th>Description</th>
											<th>OpenSource</th>
											<th>Private</th>
											<th>Usage</th>
											<th>YAML file</th>
											<th>Pins</th>
											
											<!-- <th>Available</th> -->
											

										</tr>
									</thead>

									<tbody>
										<tr role="row" class="release" v-for="release in module.releases" v-bind:key="release.uid" :id="release.uid">
											<td>
												<button 
													type="button"
													class = "btn btn-sm btn-danger mb-2" 
													@click = "removeModuleReleaseFromToolbox(release.uid)" 
													v-if="moduleReleaseIsInToolbox(release.uid)"
													:disabled = "isLoading">
														Remove from toolbox
												</button>
												
												<button 
													type="button"
													class = "btn btn-sm btn-success mb-2" 
													@click = "addModuleReleaseToToolbox(release.uid)"
													v-if="!module.isService && release.status != 3 && !moduleReleaseIsInToolbox(release.uid)" 
													:disabled = "isLoading">
														Add to toolbox
												</button>

											</td>
											<td>{{ release.uid }}</td>
											<td>{{ release.version }}</td>
											<!--<td :id="release.authorId">
												{{ release.authorName }}
											</td> -->
											<td>{{ release.date | moment("MMMM Do YYYY, HH:mm") }}</td>
											<td>{{ release.description}}</td>
											<td>{{ release.openSource }}</td>
											<td>{{ release._private }}</td>
											<td>{{ release.usageCounter }}</td>
											<td> 
												<a :href="MyencodedUri(release.yaml)" :download="release.uid + '.yaml'" >Download .yaml</a>
											</td>
											
											<!-- <td>
											<div class="col-md-12" style="margin-bottom: 10px;">
												<button v-if="release._isInstalled" type="button" class="btn btn-sm btn-danger" v-on:click="uninstallApp">Remove from Cockpit</button>
												<button v-else type="button" class="btn btn-sm btn-success" v-on:click="installApp">Add to Cockpit</button>
											</div> 
											</td> -->
											<td>
												<table class="table table-bordered table-striped dataTable" id="release-table" width="80%" cellspacing="0" role="grid" aria-describedby="dataTable_info" style="width: 100%;padding:10px;">
													
													<thead>
														
														<tr role="row">
															<!-- <th>UID</th> -->
															<th>Name</th>
															<th>Binding</th>
															<th>Token Multiplicity</th>
															<th>Data Multiplicity</th>
															<th>DataType</th>
															<th>DataStructure</th>
															<th>AccessType</th>
															
															
														</tr>
													</thead>

													<tbody>
														<tr role="row" class="release" v-for="pin in release.pins" v-bind:key="pin.uid" :id="pin.uid">
															<!-- <td>{{ pin.uid }}</td> -->
														<td> {{pin.name}} </td>
														<td> {{bindingKindString(pin.binding)}} </td>
														<td> {{multiplicityKindString(pin.tokenMultiplicity)}} </td>
														<td> {{multiplicityKindString(pin.dataMultiplicity)}} </td>
														<td> {{pin.dataTypeName}} </td>
														<td> {{pin.dataStructureName}}</td>
														<td> {{pin.accessTypeName}} </td>
															
														</tr>
													</tbody>
												</table>
											</td>
											
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

	</div>
</template>

<script src="./ComputationModule.js"></script>