import {
  generateComplaintId,
  saveComplaint,
  getComplaintById,
} from "@/lib/complaints";

describe("complaints store", () => {
  it("generates a complaint ID with the expected format", () => {
    const id = generateComplaintId();
    expect(id).toMatch(/^SB[A-Z0-9]{6}$/);
  });

  it("saves and retrieves a complaint by ID", () => {
    const complaint = {
      id: generateComplaintId(),
      category: "roads",
      description: "Test pothole report",
      location: "Test Street",
      status: "submitted",
      createdAt: new Date().toISOString(),
    };
    saveComplaint(complaint);
    const found = getComplaintById(complaint.id);
    expect(found).not.toBeNull();
    expect(found.description).toBe("Test pothole report");
  });

  it("returns null for a complaint ID that does not exist", () => {
    expect(getComplaintById("SBNOTFOUND")).toBeNull();
  });
});
