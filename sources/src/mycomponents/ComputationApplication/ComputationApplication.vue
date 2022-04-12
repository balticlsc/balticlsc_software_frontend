<template>
	<div>
		<div class="row" style="margin-bottom: 10px;">
			<div class="col-md-8">
				<h6 class="m-0 font-weight-bold text-primary">
					CAL Application (diagram GUID: {{ applicationId }})
				</h6>
			</div>

			<div class="col-md-2 ">
				<div class="btn-group float-right">
					
					<button type="button" class="btn btn-info btn-sm" v-on:click="toggleGrid" v-b-tooltip.hover title="Toogle grid">
						<i class="fas fa-th"></i>
					</button>

					<button type="button" class="btn btn-info btn-sm" v-on:click="zoomOut" v-b-tooltip.hover title="Zoom out">
						<i class="fas fa-search-minus"></i>
					</button>

					<button type="button" class="btn btn-info btn-sm" v-on:click="zoomIn" v-b-tooltip.hover title="Zoom in">
						<i class="fas fa-search-plus"></i>
					</button>				

				</div>
			</div>


			<div class="col-md-2 ">
				<div class="btn-group float-right">
					<button id="export-diagram" type="button" class="btn btn-info btn-sm" v-on:click="exportDiagram" v-b-tooltip.hover title="Export">
						<i class="fas fa-download"></i>
					</button>

					<button v-if="!isReadOnly" type="button" class="btn btn-info btn-sm" v-on:click="importDiagram" v-b-tooltip.hover title="Import">
						<i class="fas fa-upload"></i>
					</button>

					<!--<button type="button" data-toggle="modal" data-target="#edit-form" class="btn btn-info btn-sm" v-b-tooltip.hover title="Edit diagram">
						<i class="fas fa-edit"></i>
					</button>

					<button type="button" data-toggle="modal" data-target="#form_0" class="btn btn-danger btn-sm" v-on:click="deleteDiagram" v-b-tooltip.hover title="Delete">
						<i class="fas fa-trash"></i>
					</button>-->
				</div>

				<input id="import-file" type='file' v-on:change="importFileUploaded" hidden/>


				<div class="modal fade" id="edit-form">
					<div class="modal-dialog">
						<div class="modal-content">

							<div class="modal-header">
								<h4 class="modal-title">Edit application</h4>
								<button type="button" class="close" data-dismiss="modal">&times;</button>
							</div>
			
							<div class="modal-body">
								<form>
									<div class="form-group">
										<label for="recipient-name" class="col-form-label">Name</label>
										<input id="task-name" type="text" class="form-control">
									</div>

									<div class="form-group">
										<label for="recipient-name" class="col-form-label">Desctiption</label>
										<input type="text" class="form-control">
									</div>
								</form>
							</div>

							<div class="modal-footer">
								<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
								<button type="button" class="btn btn-primary" data-dismiss="modal" v-on:click="editApp">OK</button>
							</div>

						</div>
					</div>
				</div>


			</div>
		</div>
		
		<div class="row">
			<div class="col-md-10">
				<div id="editor" v-on:keyup.13="processKeyStroke"></div>
				<!-- <div class="context-menu"> -->
					
				<div v-if="!isReadOnly" id="contextMenuContainer">
					<!-- {{> contextMenuTemplate}} -->

					<ul id="contextMenu" class="dropdown-menu" role="menu" :x="x" :y="y" :style="style">
						<li class="context-menu-item-li dropdown-item" v-for="item in menu" v-bind:key="item.id" v-on:click="executeMenuProcedure">
							<a class="context-menu-item" tabindex="-1" href="#" :procedure="item.procedure" :data="item.data" :index="item.index" style="text-decoration:none;cursor:none;" >{{item.text}}</a>
						</li>
					</ul>

				</div>
			</div>

			<div v-if="isActiveElement()" class="col-md-2" style="background: white;">
				<form >
					<div class="" v-for="row in dialog" v-bind:key="row._id">
						
						<div v-if="row.inputType.inputType=='none'" class="form-group">
							<label :for="row._id">{{ row.name }}</label>
							<p style="margin-bottom:0px;" :id="row._id">{{row.value}} </p>
						</div>


						<div v-if="row.inputType.inputType=='text'" class="form-group">
							<label :for="row._id">{{ row.name }}</label>
							<input :type="row.type" class="form-control input-field" :id="row._id" :elem_id="row.elementId" placeholder="" v-on:blur="updateInput" :value="row.value" :disabled="isDisabled()">
						</div>

						<div v-else-if="row.inputType.inputType=='checkbox'" class="form-group">
							<label class="label-checkbox">
								<input type="checkbox" :id="row._id" :elem_id="row.elementId" :checked="row.value" v-on:click="updateCheckbox" :disabled="isDisabled()">
								<span class="custom-checkbox"></span>
								{{ row.name }}
							</label>
						</div>

						<div v-else-if="row.inputType.inputType=='select'" 
							class="form-group" 
							v-show="shouldSelectBeVisible(row)"
						>
							
							<label :for="row._id">{{ row.name }}: </label> <br/>
							<!-- {{row}} -->
							<select v-model="row.value" 
									:id="row._id" 
									:elem_id="row.elementId" 
									@change="updateSelect" 
									class="form-control"
									:disabled="isDisabled()"
							>
									<option disabled value="">Please select one</option>
									<option v-for=" opt_val in getListOfDropDownValues(row.name)" :value="opt_val.uid" :key="opt_val.uid"> 
										{{opt_val.name}}
									</option>
							</select>
						
						</div>
					</div>
					
					<button v-if="isAddPortButtonActive()" v-on:click="addPortIn(null, null, null, null, null)" >Add pin in</button>
					<button v-if="isAddPortButtonActive()" v-on:click="addPortOut(null, null, null, null, null)" >Add pin out</button>
				</form>
			</div>
			<!--<div v-else class="col-md-3" style="background: white;">
				<p>Diagram Dialog section. Stay tuned...</p>
				
				<input type="button" value="Generate CAL MM instance" @click="generateCALMMInstance()">
			</div>
			-->
		</div>
	</div>
</template>

<script src="./ComputationApplication.js"></script>