<template>
	<div>
		<!-- The Modal for the app -->
		<div class="modal" id="myModal">
			<div class="modal-dialog">
				<div class="modal-content">

					<!-- Modal Header -->
					<div class="modal-header">
							<h4 class="modal-title">Create new application ... </h4>
							<button type="button" class="close" data-dismiss="modal">&times;</button>
					</div>

					<!-- Modal body -->
					<div class="modal-body">
						<div class="form-group">
							<label for="exampleInputEmail1">Application name:</label>
							<input type="text" class="form-control" id="application_name_id" aria-describedby="emailHelp" placeholder="Enter application name ... ">
							
						</div>
						
					</div>

					<!-- Modal footer -->
					<div class="modal-footer">
						<button type="button" class="btn btn-primary" data-dismiss="modal" @click="createNewApplicationClicked">Create</button>
						<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
					</div>

				</div>
			</div>
		</div>

		<!-- The Modal for the module :)  -->
		<div class="modal" id="createModule">
			<div class="modal-dialog">
				<div class="modal-content">

					<!-- Modal Header -->
					<div class="modal-header">
						<h4 class="modal-title">Create new module ... </h4>
						<button type="button" class="close" data-dismiss="modal">&times;</button>
					</div>

					<!-- Modal body -->
					<div class="modal-body">
						<div class="form-group">
							<label for="exampleInputEmail1">Module name:</label>
							<input type="text" class="form-control" id="module_name_id" aria-describedby="emailHelp" placeholder="Enter module name ... ">
							
						</div>
						
					</div>

					<!-- Modal footer -->
					<div class="modal-footer">
						<button type="button" class="btn btn-primary" data-dismiss="modal" @click="createNewModuleClicked">Create</button>
						<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
					</div>

				</div>
			</div>
		</div>
		
		<!-- The Modal for App release  -->
		<div class="modal" id="createAppRelease">
			<div class="modal-dialog">
				<div class="modal-content">

					<!-- Modal Header -->
					<div class="modal-header">
							<h4 class="modal-title">Create new application release ... </h4>
							<button type="button" class="close" data-dismiss="modal">&times;</button>
					</div>

					<!-- Modal body -->
					<div class="modal-body">
						<div class="form-group">
							<label for="app_release_version_name_id" >Version :</label>
							<input type="text" class="form-control" id="app_release_version_name_id" 
									:class  = "{'is-invalid': validateRelease && releaseName != null && releaseName.trim().length < 1 }"
									@blur   = "validateRelease = true"
									v-model = "releaseName" 
									aria-describedby="emailHelp" placeholder="Enter version  ... ">
							<div class="invalid-feedback">A non empty version description is required</div>
      
							
						</div>
						
					</div>

					<!-- Modal footer -->
					<div class="modal-footer">
						<button type="button" class="btn btn-primary" @click="createAppReleaseClicked()">Create</button>
						<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
					</div>

				</div>
			</div>
		</div>

		<!-- The Modal for Module release  -->
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
									<input type="text" class="form-control col-md-10" id="name_id" v-model="moduleRelease.versionName"
											placeholder="Enter version name  ... ">
									<div class="invalid-feedback">A non empty name is required</div>
								</div>

								<div class="form-group row mr-2">
									<!-- class="col-md-2 col-form-label text-right" -->
									<label for="description_id" class="col-md-2 col-form-label text-right" >Description :</label>
									<input type="text" class="form-control col-md-10" id="description_id" v-model="moduleRelease.description"
											placeholder="Enter description  ... ">
									<!-- <div class="invalid-feedback">A non empty name is required</div> -->
								</div>

								<div class="form-group row mr-2">
									<!-- class="col-md-2 col-form-label text-right" -->
									<label for="description_id" class="col-md-2 col-form-label text-right" >Image :</label>
									<input type="text" class="form-control col-md-10" id="imageName_id" v-model="moduleRelease.imageName"
											placeholder="Enter image name  ... ">
									<!-- <div class="invalid-feedback">A non empty name is required</div> -->
								</div>

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

		<!-- The Modal for Module toolbox  -->
		<div class="modal" id="showModuleToolbox">
			<div class="modal-dialog modal-xl">
				<div class="modal-content">

					<!-- Modal Header -->
					<div class="modal-header">
							<h4 class="modal-title">Unit releases currently in the toolbox </h4>
							<button type="button" class="close" data-dismiss="modal">&times;</button>
					</div>

					<!-- Modal body -->
					<div class="modal-body">
						<div v-if="modalNotification" id="show-toolbox-form-notification"  class="alert alert-dismissible fade show alert-info" :class="modalNotification.type" @click="clearModalMessage()">
							{{modalNotification.msg}}
							<button type="button" class="close" data-dismiss="alert">&times;</button>
						</div>
						<div class="table-responsive">
								<table class="table table-bordered table-striped dataTable" id="release-table" width="100%" cellspacing="0" role="grid" aria-describedby="dataTable_info" style="width: 100%;padding:10px;">
									<thead>
										<tr role="row">
											<th>Icon</th>
											<th>Unit name</th>
											<!-- <th>Author</th> -->
											<th>Unit UID</th>
											<th>Unit release version</th>
											<th>Unit release UID</th>
											<th>Action</th>
											<!-- <th>Private</th>
											<th>Usage</th>
											<th>Available</th> -->
										</tr>
									</thead>

									<tbody>
										<tr role="row" class="release" 
											
											v-for="toolbox_item in modulesInToolbox" v-bind:key="toolbox_item.uid" :id="toolbox_item.uid">
												<td><img :src="toolbox_item.unit.icon" style="width:25px;height:25px;"></td>
												<td>{{ toolbox_item.unit.name }}</td>
												<!--<td :id="release.authorId">
													{{ release.authorName }}
												</td> -->
												
												<td> {{toolbox_item.unit.uid}}</td>
												<td>{{ toolbox_item.version}}</td>
												<td>{{ toolbox_item.uid}}</td>
												<td> 
													<button 
														type="button"
														class = "btn btn-sm btn-outline-danger" 
														@click = "removeModuleReleaseFromToolbox(toolbox_item.uid)" >
															Remove
													</button>
												</td>
												<!-- <td>{{ release._openSource }}</td>
												<td>{{ release._private }}</td>
												<td>{{ release.usageCounter }}</td> -->
												<!-- <td>
												<div class="col-md-12" style="margin-bottom: 10px;">
													<button v-if="release._isInstalled" type="button" class="btn btn-sm btn-danger" v-on:click="uninstallApp">Remove from Cockpit</button>
													<button v-else type="button" class="btn btn-sm btn-success" v-on:click="installApp">Add to Cockpit</button>
												</div>
												</td> -->
										</tr>
										
										<tr v-if="! modulesInToolbox || modulesInToolbox.length <= 0">
											<td colspan = "100" class ="text-center">No unit releases found in the toolbox. </td>
										</tr>
									</tbody>
								</table>
							</div>
					</div>

					<!-- Modal footer -->
					<div class="modal-footer">
						<!-- <button type="button" class="btn btn-primary" @click="createModuleReleaseClicked()">Create</button> -->
						<button type="button" class="btn btn-secondary" data-dismiss="modal" @click="clearModalMessage()">Close</button>
					</div>

				</div>
			</div>
		</div>

		<div class="modal" id="delete-app">
			<div class="modal-dialog">
				<div class="modal-content">

					<div class="modal-header">
						<h5 class="modal-title">Delete application. Are you sure?</h5>
						<button type="button" class="close" data-dismiss="modal">&times;</button>
					</div>

					<div class="modal-body">
						<div class="alert alert-danger" role="alert">
							You are about to delete application <span v-if="currApp">"{{currApp.name}}"</span>. Are you sure ?
							
						</div>
					</div>

					<div class="modal-footer">
						<button type="button" class="btn btn-danger" data-dismiss="modal" @click = "deleteComputationUnit(currApp.uid)">Delete</button>
						<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
					</div>

				</div>
			</div>
		</div>
		
		<div id="alerts_success" class="alert alert-success collapse" role="alert">
			{{statusMessage}}
			<button type="button" class="close" data-dismiss="alert" aria-label="Close">
				<span aria-hidden="true">&times;</span>
			</button>
		</div>
		
		<!-- <hr class="mb-4"> -->




		<div class="row justify-content-end mb-2 mr-1">
			<div class="form-check">
				<input type="checkbox" class="form-check-input" id="showOnlyOwnedId" v-model="showOnlyOwned">
				<label class="form-check-label" for="showOnlyOwnedId">Show only owned units</label>
			</div>
		</div>

		<div class="row justify-content-end">
			<div class="btn-group ">
				<button type="button" class="btn btn-info btn-sm mr-2" data-toggle="modal" data-target="#myModal"> Create application</button>
				<button type="button" class="btn btn-info btn-sm mr-2" data-toggle="modal" data-target="#createModule"> Create module</button>
				<button type="button" class="btn btn-info btn-sm mr-2" data-toggle="modal" data-target="#showModuleToolbox"> Show toolbox content </button>
			</div>
		</div>
		
		<!-- <div class="row justify-content-end mb-2 mr-1">
			<button class="btn btn-info btn-sm" type="button">Sort By</button>
		</div> -->

		<!-- <div class="row">  -->
			<ul class="nav nav-pills">

				<li class="nav-item">
					<a class="nav-link active" href="#applications" data-toggle="tab" id="applicationsPill" role="tab">Applications</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="#modules" data-toggle="tab" id="modulesPill" role="tab">Modules</a>
				</li>
			</ul>
			<br/>
			<div class="tab-content">
				<div class="tab-pane fade show active" id="applications">
					<!-- <br/> -->
					<div class = "container-fluid ml-2">

						<div class="row ">
							<!-- <div class="col-xl-4 col-md-6 mb-4 app" v-for="app in authoredApplications" v-bind:key="app.uid" :id="app.uid"> -->
								<div class="app mr-3 mb-4 col-5" v-for="app in appsToShow" v-bind:key="app.uid" :id="app.uid" :title="app.name"> 
								<div class="media shadow h-100 pt-2" style="background: white;">
									<img :src="app.icon" class=" align-self-start mr-3" alt="" style="margin-left: 7px;" width="50" height="50">
									<div class="media-body mb-0 pb-0">
										<div class="row  mb-0 pb-0">
											<div class="col-7">
												<div>
													<h5 class="mt-0">
														<router-link :to="{ name: 'AppDetails', params: {id: app.uid } }">
															{{ app.name.length > 30 ? app.name.substr(0,27) + " ..." : app.name }}
														</router-link>
													</h5>
												</div>

												<div>
													<!-- <span class="small"> &bull; </span> -->
													<span class="small">
														Updated {{app._lastUpdateDate}}	
													</span>
												</div>

												<div>
													<span class="small">
														{{ app.shortDescription }}
													</span>
												</div>

												<div>
													<span class="badge badge-secondary" style="margin-right: 5px;" v-for="keyword in app.keywords" v-bind:key="keyword">{{ keyword }}</span>
												</div>

											</div>
											<div class = "col-5 ">
												<div class="btn-group-vertical text-nowrap pr-2 float-right">
													<router-link 	v-if="app.diagramUid != null && isAppOwnedByCurrentUser(app)" 
																	:to="{ name: 'ComputationApplication', params: {applicationId: app.diagramUid } }" 
																	tag="button" 
																	class="btn btn-sm btn-outline-primary mb-2" 
																	:disabled="app.diagramUid == null"
													>
															{{ "Edit diagram" }}
													</router-link>
													<button type="button" class="btn btn-sm btn-outline-primary mb-2"  
														@click="showCreateAppReleaseModal(app.uid)"
														v-if="isAppOwnedByCurrentUser(app)" 
														> Create release 
													</button>
													<button type="button" class="btn btn-sm btn-outline-primary  text-nowrap mb-2" 
														v-if = "!isUnitDeprecated(app) && canAddModuleToToolBox(app)"
														@click="addAppToToolboxById(app.uid)" 
														data-toggle="tooltip" title="Add last release to toolbox"
														>
															Add to toolbox
													</button>
													<!-- @click="deleteComputationUnit(app.uid)"  -->
													<!-- <button type="button" 
															v-if = "isAppOwnedByCurrentUser(app)" 
															class="btn btn-sm btn-outline-danger mb-2"
															
															@click="currApp = app"
															title="Delete application"
															data-toggle="modal" 
															data-target="#delete-app"
															>
														Delete
													</button> -->
													<button type="button" class="btn btn-sm btn-outline-danger text-nowrap mb-2" 
														v-if = "canRemoveUnitFromToolbox(app)"
														@click="removeAllUnitReleasesFromToolbox(app)" 
														data-toggle="tooltip" title="Remove all releases from toolbox"
														>
															Remove from toolbox
													</button>
												</div>
											</div>
										</div>
										<br/>
									</div>
								</div>
							</div>
						</div>
					</div>
							
							
						
				</div>

				<div class="tab-pane fade" id="modules">
					
					<div class="container-fluid ml-2">
						<!-- <div class="btn-group col-sm-3 offset-sm-9">
							<button type="button" class="btn btn-info btn-sm  mr-2" data-toggle="modal" data-target="#showModuleToolbox"> Show toolbox content </button>
							<button type="button" class="btn btn-info btn-sm " data-toggle="modal" data-target="#createModule"> Create module</button>
						</div> -->
					
						<!-- <br/>
						<div class="container-fluid">
							<div class="row">
								<div class="col-md-12 bg-light text-right">
									<button type="button" class="btn btn-primary">Cancel</button>
									<button type="button" class="btn btn-warning">Save</button>
								</div>
							</div>
						</div> -->
						<!-- <div class = "row col-md-11 pull-right">
							<div class="btn-group pull-right">
								<button type="button" class="btn btn-info btn-sm  mr-2" data-toggle="modal" data-target="#showModuleToolbox"> Show toolbox content </button>
								<button type="button" class="btn btn-info btn-sm " data-toggle="modal" data-target="#createModule"> Create module</button>
							</div>
						</div> -->
						<div class="row ">
							<div class=" app mr-3 mb-4 col-5" v-for="app in modulesToShow" v-bind:key="app.uid" :id="app.uid" :title = "app.name">
								<div class="media shadow h-100 py-2" style="background: white;">
									<img :src="app.icon" class=" align-self-start mr-2" alt="" style="margin-left: 7px;" width="50" height="50">
									<div class="media-body">
										<div class="row ">
											<div class="col-7 ">
												<div>
													<h5 class="mt-0">
														<router-link :to="{ name: 'ComputationModule', params: {moduleId: app.uid } }">
															{{ app.name.length > 30 ? app.name.substr(0,27) + " ... " : app.name }}
														</router-link>
													</h5>
												</div>

												<div>
													<!-- <span class="small"> &bull; </span> -->
													<span class="small">
														Updated {{app._lastUpdateDate}}
													</span>
												</div>

												<div>
													<span class="small">
														{{ app.shortDescription }}
													</span>
												</div>

												<div>
													<span class="badge badge-secondary" style="margin-right: 5px;" v-for="keyword in app.keywords" v-bind:key="keyword">{{ keyword }}</span>
												</div>
											</div>

											<div class = "col-5">
												<div class="btn-group-vertical  pr-2 float-right">
													<button type="button" class="btn btn-sm btn-outline-primary text-nowrap mb-2" 
														@click="showCreateModuleReleaseModal(app.uid)" 
														
														v-show="isModuleOwnedByCurrentUser(app)"
														>
														Create release
													</button>

													<button type="button" class="btn btn-sm btn-outline-primary  text-nowrap mb-2" 
														v-if = "!isUnitDeprecated(app) && canAddModuleToToolBox(app)"
														@click="addModuleToToolboxById(app.uid)" 
														data-toggle="tooltip" title="Add last release to toolbox"
														>
															Add to toolbox
													</button>
													<button type="button" class="btn btn-sm btn-outline-danger text-nowrap mb-2" 
														v-if = "canRemoveUnitFromToolbox(app)"
														@click="removeAllUnitReleasesFromToolbox(app)" 
														data-toggle="tooltip" title="Remove all releases from toolbox"
														>
															Remove from toolbox
													</button>
												</div>
											</div>
										</div>
										<br/>
									</div>
								</div>
							</div>
						</div>
					</div>
					</div>
				</div>
			</div>
		<!-- </div> -->
	</div>
</template>

<script src="./ComputationApplications.js"></script>
